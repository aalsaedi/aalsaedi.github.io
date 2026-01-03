import Enemy from './Enemy.js';

export default class Enemies extends Phaser.Physics.Arcade.Group {
    constructor(world, scene) {
        super(world, scene);

        this.classType = Enemy;

        // Configuration for enemy types
        this.germConfig = [
            { animation: 'germ1', speed: 60 },
            { animation: 'germ2', speed: 90 },
            { animation: 'germ3', speed: 120 },
            { animation: 'germ4', speed: 180 },
        ];

        this.delay1 = 2000; // Initial spawn delay
        this.enemyPower = 10; // Base enemy power
    }

    start() {
        
        // Periodically release new germs
        this.timedEvent = this.scene.time.addEvent({
            delay: this.delay1,
            callback: this.releaseGerm,
            callbackScope: this,
            loop: true,
        });
    }

    stop() {
        if (this.timedEvent) {
            this.timedEvent.remove();
        }

        this.getChildren().forEach((child) => {
            child.stop(); // Stop each enemy
        });
    }

    releaseGerm() {
        const x = Phaser.Math.RND.between(50, this.scene.game.config.width - 50); // Random horizontal position
        const y = 0; // Spawn at the top

        // Adjust difficulty over time
        if (this.delay1 >= 500) {
            this.delay1 -= 10; // Reduce spawn delay
        }
        if (this.enemyPower < 100) {
            this.enemyPower++; // Increase enemy strength
        }

        // Pick a random germ configuration
        const config = Phaser.Math.RND.pick(this.germConfig);

        // Try to reuse an existing enemy
        let enemy = this.getChildren().find(
            (child) => child.anims.getName() === config.animation && !child.active
        );

        if (enemy) {
            enemy.restart(x, y);
        } else {
            // Create a new enemy if none available
            enemy = new Enemy(this.scene, x, y, config.speed, this.enemyPower);
            this.add(enemy, true);
            enemy.start();
        }
    }
}
