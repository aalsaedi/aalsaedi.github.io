export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, speed, power, texture = 'enemy1') {
        super(scene, x, y, texture);

        // Add to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(Phaser.Math.FloatBetween(0.10, 0.20));

        // Set enemy properties
        this.speed = speed; // Movement speed
        this.power = power; // Health or power level
        this.setActive(false); // Initially inactive
        this.setVisible(false); // Initially invisible

        // Enable collision boundaries
        this.setCollideWorldBounds(true);
    }

    start(delay = 0) {
        // Activate the enemy with a small delay
        this.scene.time.delayedCall(delay, () => {
            this.setActive(true);
            this.setVisible(true);
            this.body.setVelocityY(this.speed); // Move downwards at the set speed
        });
    }

    stop() {
        // Deactivate the enemy
        this.setActive(false);
        this.setVisible(false);
        this.body.setVelocity(0, 0); // Stop movement
    }

    restart(x, y) {
        // Reuse enemy by resetting position and reactivating it
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.body.setVelocityY(this.speed); // Restore movement
    }

    losePower(amount) {
        // Decrease the enemy's power
        this.power -= amount;

        // Optional: Flash effect on damage
        this.setTint(0xff0000); // Flash red
        this.scene.time.delayedCall(100, () => this.clearTint());
    }

    getPower() {
        // Return the current power level
        return this.power;
    }

    destroy() {
        // Override destroy to include custom cleanup
        this.stop();
        super.destroy();
    }
}
