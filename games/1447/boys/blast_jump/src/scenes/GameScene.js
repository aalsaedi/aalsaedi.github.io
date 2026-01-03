import Player from "../objects/Player.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    this.setupWorld();

    // ✅ BACKGROUND (fixed to camera)
    this.background = this.add
      .image(0, 0, "sky")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(-100);
  this.fireSound = this.sound.add('fire', { volume: 0.01 });
    this.setupPlatforms();
    this.setupBullets();
    this.setupPlayer();
    this.setupIceSensor();
    this.setupColliders();
    this.setupCamera();
    this.setupUI();
    this.setupInstructionUI();
    this.setupFinishUI();

    this.isStunned = false;
    this.stunUntil = 0;

    this.input.keyboard.on("keydown-T", () => {
      this.teleportTo(0, 0); // <-- CHANGE THESE NUMBERS ANYTIME
    });

    // prevents hazard overlap from re-stunning every frame
    this.hazardCooldownUntil = 0;

    this.events.once("shutdown", this._cleanup, this);

    this.bgMusic = this.sound.add('bgMusic', {
  loop: true,
  volume: 0.2
});

// Start music after first user interaction (important!)
this.input.once('pointerdown', () => {
  this.bgMusic.play();
});

// Keep your bgMusic reference somewhere:
/// this.bgMusic = this.sound.add('music', { loop: true, volume: 0.4 });

this.sfxMuted = false;
this.musicMuted = false;

// SFX button
this.sfxBtn = this.add.text(16, 12, "🔊 SFX", { fontSize: "18px", color: "#fff", backgroundColor: "#000", padding: { x: 10, y: 6 } })
  .setScrollFactor(0).setDepth(9999).setInteractive({ useHandCursor: true });

this.sfxBtn.on("pointerdown", () => {
  this.sfxMuted = !this.sfxMuted;
  this.sfxBtn.setText(this.sfxMuted ? "🔇 SFX" : "🔊 SFX");
});

// Music button
this.musicBtn = this.add.text(120, 12, "🎵 Music", { fontSize: "18px", color: "#fff", backgroundColor: "#000", padding: { x: 10, y: 6 } })
  .setScrollFactor(0).setDepth(9999).setInteractive({ useHandCursor: true });

this.musicBtn.on("pointerdown", () => {
  this.musicMuted = !this.musicMuted;

  if (this.bgMusic) this.bgMusic.setMute(this.musicMuted);

  this.musicBtn.setText(this.musicMuted ? "🔇 Music" : "🎵 Music");
});


  }

  setupPlatforms() {
    this.platforms = this.physics.add.staticGroup();
    this.icePlatforms = this.physics.add.staticGroup();
    this.hazards = this.physics.add.staticGroup();

    // moving platforms must be DYNAMIC
    this.movingPlatforms = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    const toWorldY = (yFromBottom) => this.WORLD_HEIGHT - yFromBottom;

    const applySize = (s, obj) => {
      if (obj.w != null || obj.h != null) {
        s.setDisplaySize(obj.w ?? s.width, obj.h ?? s.height);
      } else {
        s.setScale(obj.scaleX ?? 1, obj.scaleY ?? 1);
      }
    };

    const makeStatic = (group, obj) => {
      const y = toWorldY(obj.y);
      const s = group.create(obj.x, y, obj.texture);
      applySize(s, obj);
      if (obj.tint != null) s.setTint(obj.tint);
      s.refreshBody();
      return s;
    };

    const makeMoving = (obj) => {
      const y = toWorldY(obj.y);
      const s = this.movingPlatforms.create(obj.x, y, obj.texture);

      applySize(s, obj);
      if (obj.tint != null) s.setTint(obj.tint);

      s.body.setAllowGravity(false);
      s.body.immovable = true;

      s.moveType = obj.moveType ?? "x"; // "x" or "y"
      s.start = obj.start ?? obj.x;
      s.end = obj.end ?? obj.x + 200;
      s.speed = obj.speed ?? 120;

      if (s.moveType === "y") {
        s.body.setVelocity(0, -Math.abs(s.speed));
      } else {
        s.body.setVelocity(Math.abs(s.speed), 0);
      }

      s.lastX = s.x;
      s.lastY = s.y;
      s.dx = 0;
      s.dy = 0;

      return s;
    };

    const objects = [
      { group: "platforms", x: 200, y: 400, texture: "platform_stone", w: 200, h: 32 },
      { group: "platforms", x: 400, y: 200, texture: "platform_stone", w: 200, h: 32 },

      { group: "hazards", x: 400, y: 600, texture: "spike", w: 50, h: 32 },
      { group: "icePlatforms", x: 0, y: 700, texture: "platform_ice", w: 300, h: 30 },
      { group: "icePlatforms", x: 400, y: 800, texture: "platform_ice", w: 300, h: 30 },

      { group: "hazards", x: 0, y: 1200, texture: "spike", w: 50, h: 32 },
      { group: "platforms", x: 200, y: 1350, texture: "platform_stone", w: 50, h: 32 },
      { group: "platforms", x: 600, y: 1250, texture: "platform_stone", w: 50, h: 32 },
      { group: "hazards", x: 400, y: 1250, texture: "spike", w: 50, h: 32 },
      { group: "platforms", x: 10, y: 1300, texture: "platform_stone", w: 60, h: 30 },
      { group: "icePlatforms", x: 600, y: 1500, texture: "platform_ice", w: 150, h: 30 },
      { group: "hazards", x: 500, y: 1500, texture: "spike", w: 50, h: 32 },
      { group: "hazards", x: 400, y: 1250, texture: "spike", w: 50, h: 32 },
      { group: "platforms", x: 800, y: 1700, texture: "platform_stone", w: 150, h: 32 },

      { group: "hazards", x: 0, y: 1800, texture: "spike", w: 50, h: 32 },
      {
        group: "movingPlatforms",
        x: 300,
        y: 1850,
        texture: "platform_stone",
        w: 220,
        h: 32,
        moveType: "x",
        start: 200,
        end: 650,
        speed: 140,
      },
      { group: "icePlatforms", x: 200, y: 2200, texture: "ice_wall_tile", w: 150, h: 400 },
      { group: "platforms", x: 350, y: 2015, texture: "platform_stone", w: 150, h: 32 },
      { group: "platforms", x: 600, y: 2200, texture: "platform_stone", w: 60, h: 32 },
      { group: "hazards", x: 500, y: 2200, texture: "spike", w: 60, h: 32 },

      { group: "hazards", x: 0, y: 2400, texture: "spike", w: 50, h: 32 },
      { group: "icePlatforms", x: 650, y: 2500, texture: "platform_ice", w: 50, h: 30 },
      { group: "icePlatforms", x: 400, y: 2600, texture: "platform_ice", w: 50, h: 30 },
      { group: "icePlatforms", x: 650, y: 2700, texture: "platform_ice", w: 50, h: 30 },
      { group: "icePlatforms", x: 150, y: 2700, texture: "platform_ice", w: 50, h: 30 },
      { group: "icePlatforms", x: 500, y: 2900, texture: "platform_ice", w: 50, h: 30 },

      { group: "hazards", x: 0, y: 3000, texture: "spike", w: 50, h: 32 },
      {
        group: "movingPlatforms",
        x: 150,
        y: 3050,
        texture: "platform_stone",
        w: 80,
        h: 28,
        moveType: "y",
        start: 3050,
        end: 3200,
        speed: 90,
      },
      {
        group: "movingPlatforms",
        x: 300,
        y: 3300,
        texture: "platform_stone",
        w: 220,
        h: 32,
        moveType: "x",
        start: 200,
        end: 650,
        speed: 90,
      },
      {
        group: "movingPlatforms",
        x: 750,
        y: 3350,
        texture: "platform_stone",
        w: 80,
        h: 28,
        moveType: "y",
        start: 3350,
        end: 3500,
        speed: 90,
      },
      { group: "platforms", x: 100, y: 3600, texture: "platform_stone", w: 100, h: 32 },
      { group: "icePlatforms", x: 400, y: 3500, texture: "platform_ice", w: 50, h: 30 },
      { group: "platforms", x: 400, y: 3750, texture: "platform_stone", w: 100, h: 32 },

      // moving platforms (extra)
      {
        group: "movingPlatforms",
        x: 300,
        y: 520,
        texture: "platform_stone",
        w: 220,
        h: 32,
        moveType: "x",
        start: 200,
        end: 650,
        speed: 140,
      },
      {
        group: "movingPlatforms",
        x: 700,
        y: 900,
        texture: "platform_stone",
        w: 180,
        h: 28,
        moveType: "y",
        start: 900,
        end: 1150,
        speed: 90,
      },
    ];

    for (const obj of objects) {
      if (obj.group === "movingPlatforms") {
        makeMoving(obj);
      } else {
        makeStatic(this[obj.group], obj);
      }
    }
  }

  stunPlayer(ms = 1000) {
    const p = this.player.sprite;
    const now = this.time.now;

    if (this.isStunned && now < this.stunUntil) return;

    this.isStunned = true;
    this.stunUntil = now + ms;

    p.setVelocityX((Math.random() < 0.5 ? -1 : 1) * 250);
    p.setVelocityY(520);

    this.cameras.main.shake(120, 0.006);
  }

  setupWorld() {
    this.input.mouse.disableContextMenu();

    this._onGameOut = () => {
      this.input.activePointer.reset();
    };
    this.input.on("gameout", this._onGameOut);

    const W = this.scale.width;
    const H = this.scale.height;

    this.W = W;
    this.H = H;

    this.ROOM_H = H;
    this.ROOM_COUNT = 10;
    this.WORLD_HEIGHT = this.ROOM_H * this.ROOM_COUNT;

    this.physics.world.setBounds(0, 0, W, this.WORLD_HEIGHT);
    this.cameras.main.setBounds(0, 0, W, this.WORLD_HEIGHT);
  }

  teleportTo(x, yFromBottom) {
    const y = this.WORLD_HEIGHT - yFromBottom;
    const p = this.player.sprite;

    p.setPosition(x, y);
    p.setVelocity(0, 0);

    this.cameras.main.centerOn(x, y);

    this.respawnX = x;
    this.respawnY = y;
  }

  setupBullets() {
    this.bullets = this.physics.add.group({
      defaultKey: "bullet",
      maxSize: 80,
    });

    // let bullets trigger worldbounds
    this.bullets.children.iterate((b) => {
      if (!b?.body) return;
      b.body.onWorldBounds = true;
    });

    this.physics.world.on("worldbounds", (body) => {
      const bullet = body.gameObject;
      if (!bullet) return;
      if (bullet.texture?.key !== "bullet") return;

      this.bullets.killAndHide(bullet);
      bullet.body.enable = false;
    });
  }

  setupPlayer() {
    this.respawnX = 120;
    this.respawnY = this.WORLD_HEIGHT - 80;

    this.player = new Player(this, this.respawnX, this.respawnY, this.bullets);
  }

  setupIceSensor() {
    this.iceSensor = this.add.zone(this.player.sprite.x, this.player.sprite.y, 16, 6);
    this.physics.add.existing(this.iceSensor);

    const body = this.iceSensor.body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setSize(16, 6, true);
  }

  setupColliders() {
    this.physics.add.collider(this.player.sprite, this.platforms);
    this.physics.add.collider(this.player.sprite, this.icePlatforms);

    const killBullet = (bullet) => {
      this.bullets.killAndHide(bullet);
      bullet.body.enable = false;
    };
    this.physics.add.collider(this.bullets, this.platforms, killBullet);
    this.physics.add.collider(this.bullets, this.icePlatforms, killBullet);

    this.physics.add.collider(this.player.sprite, this.movingPlatforms);

    this.physics.add.overlap(
      this.player.sprite,
      this.hazards,
      () => {
        const now = this.time.now;

        if (now < this.hazardCooldownUntil) return;

        this.hazardCooldownUntil = now + 1200;
        this.stunPlayer(900);
      },
      null,
      this
    );
  }

  setupCamera() {
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
    this.cameras.main.setFollowOffset(0, -this.H * 0.25);
  }

  setupUI() {
  const padding = 16;

  this.ammoText = this.add
    .text(
      this.scale.width - padding,
      padding,
      "",
      { fontSize: "14px", color: "#ffffff" }
    )
    .setOrigin(1, 0)      // right, top
    .setScrollFactor(0); // fixed to screen
}



  setupInstructionUI() {
    // Simple "how to play" UI shown at the start. Fixed to camera.
    const W = this.scale.width;
    const H = this.scale.height;

    this.tutorialUI = this.add.container(0, 0).setScrollFactor(0).setDepth(10000);

    const panelW = Math.min(520, W - 40);
    const panelH = 210;

    const panel = this.add
      .rectangle(W / 2, H * 0.22, panelW, panelH, 0x000000, 0.55)
      .setStrokeStyle(2, 0xffffff, 0.35);

    const title = this.add
      .text(W / 2, H * 0.22 - panelH / 2 + 14, "How to play", {
        fontSize: "18px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0);

    const body = this.add
      .text(
        W / 2,
        H * 0.22 - panelH / 2 + 48,
        [
          "A / D : Move",
          "SPACE : Jump",
          "Mouse click : Air shot (1 per jump)",
          "you can't shoot until you jump",
          "W / Glide",
          "Avoid spikes and reach the final platform!",
          "",
          "Press SPACE (or click) to start",
        ].join("\n"),
        { fontSize: "14px", color: "#ffffff", align: "center" }
      )
      .setOrigin(0.5, 0);

    this.tutorialUI.add([panel, title, body]);

    const hide = () => {
      if (!this.tutorialUI) return;
      this.tutorialUI.destroy();
      this.tutorialUI = null;
    };

    // Hide on first "start" action
    this.input.keyboard.once("keydown-SPACE", hide);
    this.input.keyboard.once("keydown-W", hide);
    this.input.keyboard.once("keydown-UP", hide);
    this.input.keyboard.once("keydown-A", hide);
    this.input.keyboard.once("keydown-D", hide);
    this.input.once("pointerdown", hide);

    // Safety: auto-hide after a few seconds
    this.time.delayedCall(15000, hide);
  }

  setupFinishUI() {
    // Create a finish trigger above the LAST platform in the level.
    // (Last platform is the highest yFromBottom entry in setupPlatforms data.)
    const finishX = 400;
    const finishYFromBottom = 3750;
    const finishWorldY = this.WORLD_HEIGHT - finishYFromBottom;

    // Optional: a small sign hovering above the last platform (world space)
    this.finishSign = this.add
      .text(finishX, finishWorldY - 90, "🏁 Finish", { fontSize: "16px", color: "#ffffff" })
      .setOrigin(0.5)
      .setDepth(5);

    // Physics zone for detecting completion
    this.finishZone = this.add.zone(finishX, finishWorldY - 40, 180, 140);
    this.physics.add.existing(this.finishZone, true);

    this.hasFinished = false;

    this.physics.add.overlap(this.player.sprite, this.finishZone, () => {
      if (this.hasFinished) return;
      this.hasFinished = true;
      this.showFinishUI();
    });
  }

  showFinishUI() {
    const W = this.scale.width;
    const H = this.scale.height;

    // Dark overlay + centered modal (fixed to camera)
    this.finishUI = this.add.container(0, 0).setScrollFactor(0).setDepth(20000);

    const overlay = this.add.rectangle(0, 0, W * 2, H * 2, 0x000000, 0.55).setOrigin(0);

    const modalW = Math.min(520, W - 40);
    const modalH = 200;
    const modal = this.add
      .rectangle(W / 2, H / 2, modalW, modalH, 0x111111, 0.85)
      .setStrokeStyle(2, 0xffffff, 0.35);

    const title = this.add
      .text(W / 2, H / 2 - 62, "Congratulations! 🎉", {
        fontSize: "22px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const body = this.add
      .text(W / 2, H / 2 - 20, "You finished the Game!", { fontSize: "14px", color: "#ffffff" })
      .setOrigin(0.5);

    const hint = this.add
      .text(W / 2, H / 2 + 45, "Press R to restart or ESC to close", {
        fontSize: "14px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.finishUI.add([overlay, modal, title, body, hint]);

    // Simple controls
    const close = () => {
      if (!this.finishUI) return;
      this.finishUI.destroy();
      this.finishUI = null;
    };

    this.input.keyboard.once("keydown-ESC", close);
    this.input.keyboard.once("keydown-R", () => this.scene.restart());
  }

  // ---------- GAME LOOP ----------
  update(time, delta) {
    const p = this.player.sprite;
    const grounded = p.body.blocked.down;

    this.iceSensor.setPosition(p.x, p.y + p.displayHeight / 2 + 2);

    this.player.onIce = grounded && this.physics.overlap(this.iceSensor, this.icePlatforms);

    // ---------- MOVING PLATFORMS ----------
    if (this.movingPlatforms) {
      this.movingPlatforms.children.iterate((plat) => {
        if (!plat) return;

        if (plat.moveType === "y") {
          const top = this.WORLD_HEIGHT - plat.end;
          const bottom = this.WORLD_HEIGHT - plat.start;

          if (plat.y <= top) plat.body.setVelocityY(Math.abs(plat.speed));
          if (plat.y >= bottom) plat.body.setVelocityY(-Math.abs(plat.speed));
        } else {
          if (plat.x >= plat.end) plat.body.setVelocityX(-Math.abs(plat.speed));
          if (plat.x <= plat.start) plat.body.setVelocityX(Math.abs(plat.speed));
        }

        plat.dx = plat.x - (plat.lastX ?? plat.x);
        plat.dy = plat.y - (plat.lastY ?? plat.y);
        plat.lastX = plat.x;
        plat.lastY = plat.y;
      });

      if (p.body.blocked.down) {
        this.movingPlatforms.children.iterate((plat) => {
          if (!plat) return;

          const feetY = p.body.bottom;
          const platTopY = plat.body.top;

          const onTop =
            Math.abs(feetY - platTopY) <= 6 &&
            p.body.right > plat.body.left &&
            p.body.left < plat.body.right;

          if (onTop) {
            p.x += plat.dx || 0;
            p.y += plat.dy || 0;
          }
        });
      }
    }
    // --------------------------------------

    if (this.isStunned && time >= this.stunUntil) {
      this.isStunned = false;
    }

    if (!this.isStunned) {
      this.player.update();
    }

    this.ammoText.setText(`Air shots: ${this.player.airShotsLeft}/1`);
  }

  _cleanup() {
    if (this._onGameOut) {
      this.input.off("gameout", this._onGameOut);
      this._onGameOut = null;
    }
  }
}
