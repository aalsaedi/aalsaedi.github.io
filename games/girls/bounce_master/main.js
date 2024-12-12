class MainScene extends Phaser.Scene {
    constructor() {
        super();
        this.score = 0;
        this.gameOver = false;
        this.blockSpeed = 100;
        this.isGameStarted = false;
    }

    preload() {
        this.load.image('background', 'https://labs.phaser.io/assets/skies/nebula.jpg');
        this.load.spritesheet('stone', 'https://labs.phaser.io/assets/sprites/stone.png', {
            frameWidth: 32,
            frameHeight: 16,
        });
        this.load.image('stone', 'assets/stone.png');
    }

    create() {
        this.add.image(300, 200, 'background');

        this.scoreText = this.add.text(10, 10, 'Score: 0', {
            fontSize: '20px',
            fill: '#fff',
        });

        this.ball = this.add.circle(300, 300, 10, 0xFFFFFF);
        this.physics.add.existing(this.ball);
        this.ball.body.setBounce(1);
        this.ball.body.setCollideWorldBounds(true);
        this.ball.body.setVelocity(0, 0);

        this.paddle = this.add.rectangle(300, 350, 100, 20, 0x00FF00);
        this.physics.add.existing(this.paddle);
        this.paddle.body.setImmovable(true);
        this.paddle.body.setCollideWorldBounds(true);

        this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);

        this.blocks = this.physics.add.group();

        this.time.addEvent({
            delay: 2000,
            callback: this.spawnBlock,
            callbackScope: this,
            loop: true,
        });

        this.physics.add.collider(this.ball, this.blocks, this.hitBlock, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.startCountdown();
    }

    startCountdown() {
        let countdown = 3;
        const countdownText = this.add.text(300, 200, countdown, {
            fontSize: '60px',
            fill: '#fff',
        }).setOrigin(0.5);

        const timer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                countdown--;
                if (countdown > 0) {
                    countdownText.setText(countdown);
                } else {
                    countdownText.setText('GO!');
                    this.time.delayedCall(500, () => {
                        countdownText.destroy();
                        this.ball.body.setVelocity(150, 150);
                        this.isGameStarted = true;
                    });
                    timer.remove();
                }
            },
            loop: true,
        });
    }

    update() {
        if (this.gameOver || !this.isGameStarted) return;

        this.paddle.body.setVelocityX(0);
        if (this.cursors.left.isDown) {
            this.paddle.body.setVelocityX(-300);
        } else if (this.cursors.right.isDown) {
            this.paddle.body.setVelocityX(300);
        }

        if (this.paddle.x < this.paddle.width / 2) {
            this.paddle.x = this.paddle.width / 2;
        } else if (this.paddle.x > 600 - this.paddle.width / 2) {
            this.paddle.x = 600 - this.paddle.width / 2;
        }

        if (this.ball.y > this.paddle.y + this.paddle.height / 2) {
            this.endGame();
        }

        this.blocks.children.iterate((block) => {
            if (block && block.y > 400) {
                block.destroy();
                this.decreaseScore();
            }
        });
    }

    spawnBlock() {
        const x = Phaser.Math.Between(50, 550);
        const block = this.blocks.create(x, 0, 'stone');
        block.setScale(0.1);
        block.body.setVelocityY(this.blockSpeed);
    }

    hitPaddle(ball, paddle) {
        const diff = ball.x - paddle.x;
        ball.body.setVelocityX(diff * 5);
    }

    hitBlock(ball, block) {
        block.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
    }

    decreaseScore() {
        this.score -= 5;
        if (this.score < 0) this.score = 0;
        this.scoreText.setText('Score: ' + this.score);
    }

    endGame() {
        if (this.gameOver) return;
        this.gameOver = true;

        this.ball.body.setVelocity(0, 0);
        this.blocks.clear(true, true);
        this.time.removeAllEvents();
        this.physics.pause();

        this.add.text(300, 200, 'Game Over', {
            fontSize: '40px',
            fill: '#ff0000',
        }).setOrigin(0.5);

        const restartButton = this.add.text(300, 300, 'Restart', {
            fontSize: '30px',
            fill: '#00ff00',
        }).setOrigin(0.5).setInteractive();

        restartButton.on('pointerdown', () => {
            this.resetGame();
            this.scene.restart();
        });
    }

    resetGame() {
        this.score = 0;
        this.gameOver = false;
        this.blockSpeed = 100;
        this.isGameStarted = false;

        this.ball.setPosition(300, 300);
        this.ball.body.setVelocity(0, 0);

        this.paddle.setPosition(300, 350);
        this.paddle.body.setVelocityX(0);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 400,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    scene: MainScene,
};

const game = new Phaser.Game(config);
