class PlayGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }

    create() {
        // Background setup
        this.add.image(300, 225, "background").setScale(0.5);

        // Player setup
        this.player = this.physics.add.sprite(300, 350, "bee").setScale(1.5);
        this.player.setCollideWorldBounds(true);

        // Creating animations for the player
        this.anims.create({
            key: "fly",
            frames: this.anims.generateFrameNumbers("bee"),
            frameRate: 5,
            repeat: -1
        });

        this.player.anims.play("fly");

        // Initial score, lives, and level setup
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.diamondSpeed = 150; // Initial diamond speed
        this.stoneSpeed = 170;

        // Displaying score and lives
        this.scoreText = this.add.text(16, 16, "Score: 0", { fontSize: "24px", fill: "#fff" });
        this.livesText = this.add.text(16, 50, "Lives: 3", { fontSize: "24px", fill: "#fff" });

        // Creating groups for diamonds and stones
        this.diamonds = this.physics.add.group();
        this.stones = this.physics.add.group();

        // Events for spawning diamonds and stones
        this.diamondEvent = this.time.addEvent({
            delay: 1100,
            callback: this.addDiamond,
            callbackScope: this,
            loop: true
        });

        this.stoneEvent = this.time.addEvent({
            delay: 1100,
            callback: this.addStone,
            callbackScope: this,
            loop: true
        });

        // Adding collision and overlap detection
        this.physics.add.overlap(this.player, this.diamonds, this.collectDiamond, null, this);
        this.physics.add.collider(this.player, this.stones, this.hitStone, null, this);

        // Setting up player controls
        this.cursorKeys = this.input.keyboard.createCursorKeys();

        // Background music setup
        this.backgroundMusic = this.sound.add("backgroundMusic", { loop: true, volume: 0.5 });
        this.isBackgroundMusicPlaying = false; // Track background music state

        this.winSound = this.sound.add("winSound", { volume: 0.5 });
        this.loseSound = this.sound.add("loseSound", { volume: 0.5 });
    }

    update() {
        const speed = 200;

        // Player movement controls
        if (this.cursorKeys.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.setFlipX(false);
            this.playBackgroundMusic(); // Play music when moving
        } else if (this.cursorKeys.right.isDown) {
            this.player.setVelocityX(speed);
            this.player.setFlipX(true);
            this.playBackgroundMusic(); // Play music when moving
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursorKeys.up.isDown) {
            this.player.setVelocityY(-speed);
            this.playBackgroundMusic(); // Play music when moving
        } else if (this.cursorKeys.down.isDown) {
            this.player.setVelocityY(speed);
            this.playBackgroundMusic(); // Play music when moving
        } else {
            this.player.setVelocityY(0);
        }

        // Update score and lives text
        this.scoreText.setText("Score: " + this.score + "/40");
        this.livesText.setText("Lives: " + this.lives);

        // Check for winning condition
        if (this.score >= 40 && !this.hasWon) {
            this.hasWon = true; // Prevent repeating the win
            this.winGame();
        }

        // Level up when score reaches a threshold
        if (this.score >= this.level * 10) {
            this.levelUp();
        }
    }

    // Play background music if not already playing
    playBackgroundMusic() {
        if (!this.isBackgroundMusicPlaying) {
            this.backgroundMusic.play();
            this.isBackgroundMusicPlaying = true;
        }
    }

    // Stop background music if playing
    stopBackgroundMusic() {
        if (this.isBackgroundMusicPlaying) {
            this.backgroundMusic.stop();
            this.isBackgroundMusicPlaying = false;
        }
    }

    // Function to add a diamond at a random x position
    addDiamond() {
        const x = Phaser.Math.Between(50, 550);
        const diamond = this.diamonds.create(x, 0, "diamond").setScale(0.09);
        diamond.setVelocityY(this.diamondSpeed);
        diamond.body.setAllowGravity(false);

        // Diamond fade animation
        this.tweens.add({
            targets: diamond,
            alpha: { from: 0.5, to: 1 },
            duration: 1500,
            yoyo: true,
            repeat: -1
        });
    }

    // Function to add a stone at a random x position
    addStone() {
        const x = Phaser.Math.Between(50, 550);
        const stone = this.stones.create(x, 0, "stone").setScale(0.1);
        stone.setVelocityY(this.stoneSpeed);
        stone.body.setAllowGravity(false);
    }

    // Collecting diamond and increasing score
    collectDiamond(player, diamond) {
        diamond.destroy();
        this.score += 1;
    }

    // Hitting a stone and losing a life
    hitStone(player, stone) {
        stone.destroy();
        this.player.setTint(0xff0000); // Change player color on hit
        this.lives -= 1;

        // Game over if no lives left
        if (this.lives <= 0) {
            this.endGame();
        } else {
            // Temporarily disable player after hit
            this.physics.world.disable(player);
            this.time.delayedCall(500, () => {
                this.player.clearTint();
                this.physics.world.enable(player);
            });
        }
    }

    // Function to handle winning the game
    winGame() {
        this.stopBackgroundMusic();
        this.winSound.play(); // Play win sound
        this.physics.pause(); // Pause all game objects
        this.add.text(300, 225, "YOU WIN! Final Score: 40/40", {
            fontSize: "32px",
            fill: "green",
            fontWeight: "bold",
            align: "center"
        }).setOrigin(0.5); // Display win text at the center
        this.diamondEvent.remove(); // Stop spawning diamonds
        this.stoneEvent.remove(); // Stop spawning stones
    }
    
    // Level up function
    levelUp() {
        this.level += 1;
        this.diamondSpeed += 80;
        this.stoneSpeed += 80;
        const levelText = this.add.text(300, 225, "Speed will increase!", {
            fontSize: "32px",
            color: "#fff",
            fontWeight: "bold",
            align: "center"
        }).setOrigin(0.5);

        // Remove level-up text after a delay
        this.time.delayedCall(1500, () => {
            levelText.destroy(); 
        });

        this.player.setPosition(300, 350);
    }

    // End game function
    endGame() {
        this.stopBackgroundMusic();
        this.loseSound.play();
        this.physics.pause(); // Pause all game objects
        this.add.text(300, 225, "GAME OVER", {
            fontSize: "32px",
            fill: "red",
            fontWeight: "bold",
            align: "center"
        }).setOrigin(0.5); // Display game over text at the center
        this.diamondEvent.remove(); // Stop spawning diamonds
        this.stoneEvent.remove(); // Stop spawning stones
        this.scoreText.setText("Game Over! Final Score: " + this.score); // Show final score
    }
}
