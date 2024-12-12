import config from './game.js';

const jumpHeight = 100;
let originalY;
let originalX;
var score = 0;

//for Backgrounds
class FirstScene extends Phaser.Scene {
    constructor() {
        super("EndGame");
    }

    preload() {
        //backgrounds
        this.load.image("bg", "assets/bg.png");
        //audio
        this.load.audio("end", "assets/Powerup13.wav");
    }

    create(data) {
        const finalScore = data.score || 0;

        this.bg = this.add.tileSprite(0, 0, 1920, 1080, "bg");
        this.bg.setOrigin(0, 0);
        this.bg.setDisplaySize(config.width, config.height);
        this.bg.setScrollFactor(0);

        this.Text = this.add.text(config.width / 4.5, config.height / 3, 'Game Over', {
            fontSize: '100px',
            fill: '#fde61e',
            fontFamily: 'Gamer',
            fontStyle: "bold",
            stroke: "#000000",
            strokeThickness: 4,
        });

        this.scoreText = this.add.text(config.width / 2.4, config.height / 1.9, `Score: ${finalScore}`, {
            fontSize: '35px',
            fill: '#ffffff',
            fontFamily: 'Gamer',
            stroke: "#000000",
            strokeThickness: 2,
        });

        this.retryButton = this.add.text(config.width / 2.2, config.height / 1.6, 'Retry', {
            fontSize: '30px',
            fill: '#ff0000',
            fontFamily: 'Gamer',
            stroke: "#000000",
            strokeThickness: 2,
        })
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start("FirstScene"); // Replace "GameScene" with your main game scene key
        });

        this.sound.play("end", { loop: false, volume: 0.4 });
    }

    update() {
        // Update logic (if any) goes here
    }
}

export default FirstScene;
