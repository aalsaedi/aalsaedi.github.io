export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "player");

        // Add to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set up initial properties
        this.setScale(0.19);
        this.scene = scene;
        this.setCollideWorldBounds(true);

        this.isAlive = true;
        this.speed = 300;
        this.fireRate = 200; // Time between shots in milliseconds
        this.lastFired = 0;

        // Initialize controls
        this.fireKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.setupControls();
    }

    setupControls() {
        // Pointer (mouse/touch) movement
        this.scene.input.on("pointermove", (pointer) => {
            if (this.isAlive) {
                this.x = Phaser.Math.Clamp(pointer.x, 20, this.scene.game.config.width - 20);
                this.y = Phaser.Math.Clamp(pointer.y, 20, this.scene.game.config.height - 20);
            }
        });

        // Auto-fire toggle
        this.scene.input.on("pointerdown", () => {
            if (this.isAlive) {
                this.autoFire = true;
            }
        });

        this.scene.input.on("pointerup", () => {
            this.autoFire = false;
        });
    }

    start() {
        this.isAlive = true;
        this.clearTint();
    }

    update(time) {
        if (!this.isAlive) return;

        // Handle keyboard shooting
        if (Phaser.Input.Keyboard.JustDown(this.fireKey)) {
            this.shoot();
        }

        // Handle auto-fire when pointer is held
        if (this.autoFire) {
            this.shoot();
        }
    }

    shoot() {
        if (!this.isAlive) return;

        const time = this.scene.time.now;
        if (time > this.lastFired) {
            // Get a bullet from the group
            const bullet = this.scene.bullets.get(this.x, this.y - 20);

            if (bullet) {
                bullet.setActive(true);
                bullet.setVisible(true);
                bullet.setVelocityY(-200); // Move the bullet upwards
                bullet.setScale(0.5); // Adjust bullet size

                this.lastFired = time + this.fireRate; // Update last fired time
            }
        }
    }

    kill() {
        this.isAlive = false;
        this.autoFire = false;
        this.setTint(0xff0000); // Red tint to indicate death
    }
}
