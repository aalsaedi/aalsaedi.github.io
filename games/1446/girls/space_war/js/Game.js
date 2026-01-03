import Enemies from './Enemies.js';
import Player from './Player.js';
import Pickups from './Pickups.js';

export default class MainGame extends Phaser.Scene {
    constructor() {
        super('MainGame');
        this.player = null;
        this.enemies = null;
        this.pickups = null;
        this.scoreText = null;
        this.introText = null;
        this.score = 0;
        this.shootingPower = 1;
        this.highscore = 0;
        this.newHighscore = false;
    }

    create() {
        this.music = this.sound.play('music', { loop: true });

        // Create a group for bullets with physics
        this.bullets = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            defaultKey: 'bullet',
            maxSize: 30,
        });

        // Add the background
        this.add.image(400, 300, 'background').setScale(2);

        // Initialize enemies, pickups, and player
        this.enemies = new Enemies(this.physics.world, this);
        this.pickups = new Pickups(this.physics.world, this);
        this.player = new Player(this, 400, 500);

        // Score text
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '20px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 },
        });

        // Intro text
        this.introText = this.add.text(400, 300, 'Press SPACE to start!', {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5);

        // Start pickups
        this.pickups.start();

        // Start game on input
        this.input.once('pointerdown', () => {
            this.player.start();
            this.enemies.start();

            this.sound.play('start');
            this.tweens.add({
                targets: this.introText,
                alpha: 0,
                duration: 300,
            });
        });

        // Add overlap handlers
        this.physics.add.overlap(this.player, this.pickups, this.playerHitPickup, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.playerHitGerm, null, this);
        this.physics.add.overlap(this.bullets, this.enemies, this.bulletHitEnemy, null, this);
    }

    update(time, delta) {
        if (this.player) {
            this.player.update(time);
        }

        // Clean up bullets out of bounds
        this.bullets.children.each(bullet => {
            if (bullet.active && (bullet.y < -10 || bullet.y > this.game.config.height + 10)) {
                bullet.setActive(false);
                bullet.setVisible(false);
            }
        });
    }

    bulletHitEnemy(bullet, enemy) {
        bullet.destroy(); // Remove the bullet
        enemy.losePower(this.shootingPower); // Reduce enemy power
        if (enemy.getPower() <= 0) {
            enemy.destroy(); // Destroy enemy if power is depleted
        }
    }

    playerHitGerm(player, enemy) {
        if (player.isAlive) {
            this.gameOver();
        }
    }

    playerHitPickup(player, pickup) {
        this.score++;
        this.shootingPower++;

        this.scoreText.setText('Score: ' + this.score);

        if (!this.newHighscore && this.score > this.highscore) {
            this.sound.play(this.highscore > 0 ? 'victory' : 'pickup');
            this.newHighscore = true;
        } else {
            this.sound.play('pickup');
        }

        this.pickups.collect(pickup);
    }

    gameOver() {
        this.player.kill();
        this.enemies.stop();
        this.sound.stopAll();
        this.sound.play('fail');

        this.introText.setText('Game Over!');
        this.introText.alpha = 1;

        if (this.newHighscore) {
            this.registry.set('highscore', this.score);
        }

        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}
