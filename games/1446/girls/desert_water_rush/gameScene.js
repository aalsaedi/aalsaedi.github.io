export default class gameScene extends Phaser.Scene {
    constructor() {
        super("gameScene");
        this.score = 0; // Track the score
        this.timeLeft = 60; // 60-second timer
        this.rainAudioObj = {
            start:0,
            end:1,
            loop:true
        }
    }

    preload() {
        // Preload assets
        this.load.image("bg", "assets/y.jpg");
        this.load.spritesheet("player", "assets/player.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        
        this.load.image("droplet", "assets/droplet.png");
        this.load.image("rock", "assets/rock.png");
        this.load.audioSprite("rain" , this.rainAudioObj ,"assets/rain.mp3"  )
    }

    create() {
        // Add and scale the background
        const bg = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            "bg"
        );
        bg.setScale(
            Math.max(
                this.cameras.main.width / bg.width,
                this.cameras.main.height / bg.height
            )
        );

        // Create animations for the player
        this.anims.create({
            key: "container-anim",
            frames: this.anims.generateFrameNumbers("player", {
                frames: [21, 22, 23],
            }),
            frameRate: 10,
            repeat: -1,
        });

        // Add the player sprite and animation
        this.player = this.physics.add.sprite(
            this.cameras.main.width / 2,
            this.cameras.main.height - 60,
            "player"
        );
        this.sound.playAudioSprite("rain")
        this.player.setScale(3).setCollideWorldBounds(true);
        this.player.play("container-anim");

        // Groups for droplets and rocks
        this.droplets = this.physics.add.group();
        this.rocks = this.physics.add.group();

        // Add collisions
        this.physics.add.overlap(
            this.player,
            this.droplets,
            this.collectDroplet,
            null,
            this
        );
        this.physics.add.overlap(
            this.player,
            this.rocks,
            this.hitRock,
            null,
            this
        );

        // Create score and timer text
        this.scoreText = this.add.text(10, 10, "Score: 0", {
            fontSize: "24px",
            fill: "#FFFFFF",
        });
        this.timerText = this.add.text(10, 40, "Time: 60", {
            fontSize: "24px",
            fill: "#FFFFFF",
        });

        // Spawn droplets and rocks at intervals
        this.time.addEvent({
            delay: 1000,
            callback: this.spawnDropletOrRock,
            callbackScope: this,
            loop: true,
        });

        // Decrease timer every second
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.timeLeft--;
                this.timerText.setText("Time: " + this.timeLeft);
                if (this.timeLeft <= 0) this.endGame();
            },
            loop: true,
        });

        // Add keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Player movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-300);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(300);
        } else {
            this.player.setVelocityX(0);
        }
    }

    spawnDropletOrRock() {
        // Randomly spawn droplets (70% chance) or rocks (30% chance)
        const x = Phaser.Math.Between(50, this.cameras.main.width - 50);
        if (Phaser.Math.Between(0, 10) > 3) {
            const droplet = this.droplets.create(x, 0, "droplet").setScale(0.2);
            droplet.setVelocityY(200);
        } else {
            const rock = this.rocks.create(x, 0, "rock").setScale(0.14);
            rock.setVelocityY(200);
        }
    }

    collectDroplet(player , droplet) {
        // Increase score and destroy the droplet
        droplet.destroy();
        this.score += 10;
        this.scoreText.setText("Score: " + this.score);
    }

    hitRock(player ,rock) {
        // Decrease score and destroy the rock
        rock.destroy();
        this.score -= 10;
        this.scoreText.setText("Score: " + this.score);
    }

    endGame() {
        if (this.gameOverTriggered) {
            return; // stop multiple calls to endGame
        }
    
        this.gameOverTriggered = true;

        // Pause the scene and display lose or win
        if(this.score < 200){
        this.physics.pause();
        this.add.text(
            this.cameras.main.width / 2 - 80,
            this.cameras.main.height / 2 - 40,
            "You lose",
            { fontSize: "32px", fill: "#FF0000" }
        );
        this.add.text(
            this.cameras.main.width / 2 - 100,
            this.cameras.main.height / 2,
            "Final Score: " + this.score,
            { fontSize: "24px", fill: "#FFFFFF" }
        );
    }
    else{
        this.physics.pause();
        this.add.text(
            this.cameras.main.width / 2 - 80,
            this.cameras.main.height / 2 - 40,
            "You win",
            { fontSize: "32px", fill: "green" }
        );
        this.add.text(
            this.cameras.main.width / 2 - 100,
            this.cameras.main.height / 2,
            "Final Score: " + this.score,
            { fontSize: "24px", fill: "#FFFFFF" }
        );
    }
        // Restart the game after 5 seconds
        this.time.delayedCall(5000, () =>{
            
            this.scene.restart()
            this.resetGame()
            
        },
        []);
      
    }

    resetGame() {
        
        this.gameOverTriggered = false;
    
        
        this.score = 0;
        this.timeLeft = 60
    }

   
}
