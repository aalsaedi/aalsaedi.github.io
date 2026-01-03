export default class Player {
  constructor(scene, x, y, bulletsGroup) {
    this.scene = scene;
    this.bullets = bulletsGroup;

    // --------------------
    // SPRITE
    // --------------------
    this.sprite = scene.physics.add.sprite(x, y, "player");
    this.sprite.setCollideWorldBounds(true);
    this.sprite.body.setSize(20, 28);
    this.sprite.body.setOffset(6, 4);

    // We control ground friction ourselves (important for ice)
    this.sprite.setDamping(false);
    this.sprite.setDragX(0);

    // Falling / glide
    this.normalFallSpeed = 900;
    this.glideFallSpeed = 160;
    this.sprite.setMaxVelocity(400, this.normalFallSpeed);

    // --------------------
    // INPUT
    // --------------------
    // (kept your style, just grouped)
    this.keys = scene.input.keyboard.addKeys("A,D,W,SPACE");

    // --------------------
    // MOVEMENT
    // --------------------
    this.moveSpeed = 220;
    this.jumpPower = 260; // small jump



    // Normal ground friction
    this.normalFriction = 0.82;
    this.stopThreshold = 6;

    // ICE movement (brake/accelerate, keep sliding if no input)
    this.iceAccel = 900; // push/brake strength
    this.iceMaxSpeed = 260; // clamp speed while steering on ice
    this.iceStopEps = 10; // snap to 0 when braking near stop

    // This flag should be set by GameScene each frame
    this.onIce = false;

    // --------------------
    // AIR SHOTS
    // --------------------
    this.maxAirShots = 1;
    this.airShotsLeft = this.maxAirShots;
    this.wasGrounded = false;

    // --------------------
    // SHOOTING
    // --------------------
    this.shootCooldownMs = 140;
    this.lastShotTime = 0;

    this.bulletSpeed = 400;
    this.recoilStrength = 650; // strong recoil

    // Avoid stacking pointer listeners if the scene/player is recreated
    this._onPointerDown = () => this.shoot();
    scene.input.on("pointerdown", this._onPointerDown);

    scene.events.once("shutdown", () => {
      scene.input.off("pointerdown", this._onPointerDown);
    });
  }

  resetState() {
    // Makes respawns consistent
    this.airShotsLeft = this.maxAirShots;
    this.wasGrounded = false;
    this.onIce = false;
    // lastShotTime can stay; but if you want respawn to feel snappy:
    // this.lastShotTime = 0;
  }


  update() {
    const body = this.sprite.body;
    const grounded = body.blocked.down;
    const falling = body.velocity.y > 0;

    // Reload air shots on landing
    if (grounded && !this.wasGrounded) {
      this.airShotsLeft = this.maxAirShots;
    }
    this.wasGrounded = grounded;

    // Glide (hold W while falling)
    if (!grounded && falling && this.keys.W.isDown) {
      if (body.velocity.y > this.glideFallSpeed) {
        this.sprite.setVelocityY(this.glideFallSpeed);
      }
    }

    // --------------------
    // HORIZONTAL MOVEMENT
    // --------------------
    const vx = body.velocity.x;

    if (this.onIce && grounded) {
      // ICE: acceleration/braking, no friction when no key
      const dt = this.scene.game.loop.delta / 1000;

      if (this.keys.A.isDown) {
        this.sprite.setVelocityX(vx - this.iceAccel * dt);
        this.sprite.setFlipX(true);
      } else if (this.keys.D.isDown) {
        this.sprite.setVelocityX(vx + this.iceAccel * dt);
        this.sprite.setFlipX(false);
      }
      // If no A/D: do nothing => keep sliding

      // Clamp ice steering speed
      this.sprite.setVelocityX(
        Phaser.Math.Clamp(
          this.sprite.body.velocity.x,
          -this.iceMaxSpeed,
          this.iceMaxSpeed
        )
      );

      // If braking close to 0, snap to stop (feels good)
      if (
        (this.keys.A.isDown || this.keys.D.isDown) &&
        Math.abs(this.sprite.body.velocity.x) < this.iceStopEps
      ) {
        this.sprite.setVelocityX(0);
      }
    } else {
      // NORMAL: direct control + friction
      if (this.keys.A.isDown) {
        this.sprite.setVelocityX(-this.moveSpeed);
        this.sprite.setFlipX(true);
      } else if (this.keys.D.isDown) {
        this.sprite.setVelocityX(this.moveSpeed);
        this.sprite.setFlipX(false);
      } else if (grounded) {
        this.sprite.setVelocityX(vx * this.normalFriction);
        if (Math.abs(vx) < this.stopThreshold) this.sprite.setVelocityX(0);
      }
    }

    // --------------------
    // JUMP (small)
    // --------------------
    if (grounded && Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
      this.sprite.setVelocityY(-this.jumpPower);
    }
  }

  shoot() {
    if (!this.bullets) return;

    const grounded = this.sprite.body.blocked.down;
    if (grounded) return; // air only
    if (this.airShotsLeft <= 0) return; // 2 shots only

    const now = this.scene.time.now;
    if (now - this.lastShotTime < this.shootCooldownMs) return;
    this.lastShotTime = now;

    const pointer = this.scene.input.activePointer;

    // Aim toward mouse
    let dx = pointer.worldX - this.sprite.x;
    let dy = pointer.worldY - this.sprite.y;

    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;

    const bullet = this.bullets.get(
      this.sprite.x + dx * 18,
      this.sprite.y + dy * 18,
      "bullet"
    );
    if (!bullet) return;
    
    if (!this.scene.sfxMuted) this.scene.sound.play("fire");

    this.airShotsLeft--;

    bullet.setActive(true);
    bullet.setVisible(true);
    bullet.body.enable = true;
    bullet.body.allowGravity = false;

    bullet.setVelocity(dx * this.bulletSpeed, dy * this.bulletSpeed);

    // No bullet.update here — GameScene handles cleanup now.

    // Strong recoil impulse (opposite direction of bullet)
    this.sprite.setVelocity(
      -dx * this.recoilStrength,
      -dy * this.recoilStrength * 1.2
    );
  }
}
