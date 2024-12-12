export default class Pickups extends Phaser.Physics.Arcade.Group {
    constructor(world, scene) {
        super(world, scene);

        // Define the area where pickups can spawn
        this.spawnArea = new Phaser.Geom.Rectangle(64, 64, scene.game.config.width - 128, scene.game.config.height - 128);
        this.target = new Phaser.Geom.Point(); // Temporary point for placing pickups
    }

    start() {
        // Create initial pickups
        for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(this.spawnArea.x, this.spawnArea.width);
            const y = Phaser.Math.Between(this.spawnArea.y, this.spawnArea.height);
            const pickup = this.create(x, y, 'coin');
            
            // Ensure the pickup displays correctly
            pickup.setActive(true);
            pickup.setVisible(true);
            pickup.setScale(0.5); // Adjust size for better visibility
        }
    }

    collect(pickup) {
        // Randomly reposition the collected pickup
        this.spawnArea.getRandomPoint(this.target);

        pickup.body.reset(this.target.x, this.target.y);

        // Optionally, add a small effect or animation
        this.scene.tweens.add({
            targets: pickup,
            scaleX: 0.8,
            scaleY: 0.8,
            yoyo: true,
            duration: 200,
        });
    }
}
