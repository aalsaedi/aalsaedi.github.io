import config from './game.js';

const jumpHeight = 100;
let originalY;
let originalX;
var score = 0;

// for Backgrounds
class FirstScene extends Phaser.Scene {
    constructor() {
        super("FirstScene");
    }

    preload() {
        // backgrounds
        this.load.image("bg1", "assets/background/sky.png");
        this.load.image("bg2", "assets/background/clouds.png");
        this.load.image("bg3", "assets/background/sea.png");
        this.load.image("island", "assets/background/ground_part1.png");
        this.load.image("ground", "assets/background/ground_part2.png");

        this.load.image("heart", "assets/heart.png");
        // stones
        this.load.image("green", "assets/Stones/green.png");
        this.load.image("red", "assets/Stones/red.png");
        this.load.image("blue", "assets/Stones/blue.png");
        this.load.image("yellow", "assets/Stones/yellow.png");
        this.load.image("explosive", "assets/bomb.png");

        this.load.spritesheet("bomb", "assets/explosion.png", {
            frameWidth: 32,
            frameHeight: 32,
        });

        // gate
        this.load.image("new gate", "assets/gate.png");
        
        // it normal is balance in speed and powerfall
        this.load.spritesheet("dino_g", "assets/sheets/DinoSprites_vita.png", {
            frameWidth: 24,
            frameHeight: 24,
        });
        // speeder
        this.load.spritesheet("dino_b", "assets/sheets/DinoSprites_doux.png", {
            frameWidth: 24,
            frameHeight: 24,
        });
        // more powerfall (kill monster)
        this.load.spritesheet("dino_r", "assets/sheets/DinoSprites_mort.png", {
            frameWidth: 24,
            frameHeight: 24,
        });
        // no die
        this.load.spritesheet("dino_y", "assets/sheets/DinoSprites_tard.png", {
            frameWidth: 24,
            frameHeight: 24,
        });
        this.load.spritesheet("dino_e", "assets/sheets/DinoSprites_vita.png", {
            frameWidth: 24,
            frameHeight: 24,
        });


        //audio
        this.load.audio("begin", "assets/start.wav")
        this.load.audio("jump", "assets/Jump.wav")
        this.load.audio("pickup", "assets/Pickup_Coin2.wav")
        this.load.audio("shot", "assets/shot.wav")

        
    }

    create() {
        // Background setup
        this.bg1 = this.add.tileSprite(0, 0, config.width, config.height, "bg1").setOrigin(0).setDisplaySize(config.width, config.height).setScrollFactor(0);
        this.bg2 = this.add.tileSprite(0, config.height / 6, config.width, config.height, "bg2").setOrigin(0).setDisplaySize(config.width, config.height).setScrollFactor(0);
        this.bg3 = this.add.tileSprite(0, config.height / 1.3, config.width, 96, "bg3").setOrigin(0).setDisplaySize(config.width, 96).setScrollFactor(0);
        this.island = this.add.tileSprite(0, 0, 1437, 173, "island").setOrigin(0).setDisplaySize(config.width * 2, config.height / 1.2).setScrollFactor(0);
        this.ground = this.add.tileSprite(0, 0, 1587, 157, "ground").setOrigin(0).setDisplaySize(config.width * 6, config.height).setScrollFactor(0);
    
        // Hearts setup
        this.hearts = this.add.group({
            key: 'heart',
            repeat: 2,
            setXY: { x: config.width - 50 * 3 - 10, y: 10, stepX: 50 }
        });
        this.hearts.children.iterate((heart) => heart.setOrigin(0).setScrollFactor(0).setScale(1.1));
    
        // Dino setup
        this.dino = this.physics.add.sprite(config.width / 5, config.height - 90, "dino_g").setScale(3).setCollideWorldBounds(true);
        this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers("dino_g", { start: 1, end: 10 }),// Replace change_dino with "dino_g"
        frameRate: 10,
        repeat: -1,
        });
        this.dino.play('walk');
        //sound begin the game
        this.sound.play("begin", {loop: false, volume: 0.4});
        //title game
        this.titleText = this.add.text(config.width / 5, config.height / 4, 'Dino World', {
            fontSize: '100px',
            fill: '#fde61e',
            fontFamily: 'Gamer',
            fontStyle: "bold",
            stroke: "#000000",
            strokeThickness: 4,
        });
        // Set a timer to hide the text after 5 seconds
        this.time.delayedCall(2000, () => {
            this.titleText.setVisible(false);
        }, [], this);

        this.time.delayedCall(2000, () => {
            this.titleText.setVisible(false);

            // Add instructions text
            this.instructionsText = this.add.text(config.width / 4.5, config.height / 4, 
                "Controls:\nArrow Left: Move Left\nArrow Right: Move Right\nArrow Up: Jump", {
                fontSize: '30px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 4,
            });

            // Hide the instructions after 3 seconds
            this.time.delayedCall(3000, () => {
                this.instructionsText.setVisible(false);
            });
        });
        // Score Text
        this.scoreText = this.add.text(30, 10, `Score: ${score}`, {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: '"Arial"',
            stroke: '#000000',
            strokeThickness: 3,
        }).setScrollFactor(0);
    
        // Obstacles Group
        this.obstacles = this.physics.add.group();
        const colors = ["red", "blue", "yellow", "explosive"];
    
        // Spawn Obstacles Dynamically
        const gameDuration = 60000; //1 minute
        // Delay obstacles for 3 seconds
        this.time.delayedCall(5000, () => {
            let lastXPosition = this.dino.x + 50; // Horizontal position of the first obstacle (50 pixels ahead of the dino)
        
            const obstacleTimer = this.time.addEvent({
                delay: 200, // Generate an obstacle every 2 seconds
                callback: () => {
                    // List of obstacle colors
                    const color = colors[Phaser.Math.Between(0, colors.length - 1)]; // Choose a random color
                    const minHeight = config.height - 70; // Minimum height
                    const maxHeight = config.height - 200; // Maximum height
                    const randomHeight = Phaser.Math.Between(maxHeight, minHeight);// Random height
        
                    // Set the new horizontal position of the obstacle based on the last obstacle
                    lastXPosition += 150; // Set the distance between obstacles
                    // Create the obstacle at the specified horizontal position with a random height
                    const obstacle = this.obstacles.create(lastXPosition, randomHeight, color)
                            .setScale(0.04)  // Scale down the size
                            .setImmovable(true); // Make the obstacle immovable

                        obstacle.body.setVelocityX(-100); // Make the obstacle move left

                    // If the obstacle goes off-screen, remove it to save resources
                    obstacle.body.onWorldBounds = true;
                        this.physics.world.on('worldbounds', (body) => {
                            if (body.gameObject === obstacle) {
                                obstacle.destroy();
                            }
                        });
                    },
                    repeat: -1, // Repeat obstacle generation infinitely
                });
                }, [], this);
        
        
        this.obstacleTimer = null;

        // Stop Obstacles and Show Exit Gate After Game Duration
        this.time.delayedCall(gameDuration, () => {
            if (this.obstacleTimer) this.obstacleTimer.remove();
            this.showExitGate();
        }, [], this);


        this.time.delayedCall(40000, () => {
            this.exitGate = this.physics.add.group();

            this.gate = this.exitGate.create(config.width / 1.3, config.height / 1.1, 'new gate')
                .setOrigin(0, 1)
                .setScale(0.5);

            this.add.text(config.width / 1.16, config.height / 2, 'Exit', {
                fontSize: '55px',
                fill: '#ffffff',
                fontFamily: 'Gamer',
                strokeThickness: 1,
                stroke: '#000000',
            }).setDepth(8);

            this.physics.add.collider(this.dino, this.exitGate);
            this.physics.add.overlap(this.dino, this.exitGate, (dino, gate) => {
                gate.destroy(); // Hide gate when Dino collides
                this.scene.start('EndGame');
            });
        });


        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("bomb", { start: 0, end: 8 }),
            frameRate: 15,
            repeat: 0,
        });

        // Collision Handling
        this.physics.add.collider(this.dino, this.obstacles, this.handleCollision, null, this);

        // Dino Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        originalY = this.dino.y;
        originalX = this.dino.x;
    }
    updateScoreText(){
        this.scoreText.setText(`Score: ${score}`);
    }
    updateDinoAnimation(newColor) {
// Delete old animation if it exists
        if (this.anims.exists('walk')) {
            this.anims.remove('walk');
        }
    
// Create a new animation based on the new color
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers(`dino_${newColor}`, { start: 1, end: 10 }),
            frameRate: 10,
            repeat: -1
        });
    
// Play the new animation
        this.dino.play('walk');
    }
    handleCollision(dino, obstacle) {
        if(!obstacle.active)return;

        const obstacleColor = obstacle.texture.key;
        if( obstacleColor === "explosive"){
            this.sound.play("shot", {loop: false, volume: 0.2})

            const explosion = this.add.sprite(obstacle.x, obstacle.y, "bomb").setScale(1.5);
            explosion.play("explode");

            explosion.on("animationcomplete", () => {
                explosion.destroy();
            });


            let heart = this.hearts.getChildren()[0]; //Get the first heart
            if (heart) {
                heart.destroy(); // Delete heart
                this.hearts.remove(heart); // Remove it from the group
            }
            if (this.hearts.getLength() === 0 && !this.gameOver) {
                this.gameOver = true;
                this.scene.start('EndGame', { score: score });
            }
        }else{
            this.sound.play("pickup", {loop: false, volume: 0.4})
            score += 1;
            this. updateScoreText();
        }
        this.dino.setTexture(`dino_${obstacleColor.charAt(0)}`); // Change dinosaur image
        this.updateDinoAnimation(obstacleColor.charAt(0)); // Update animation
        score +=1;
        this.updateScoreText();
        obstacle.setActive(false).setVisible(false);

    }
    
    update() {
        this.bg1.tilePositionX += 0.3;
        this.bg2.tilePositionX += 0.6;
        this.bg3.tilePositionX += 0.8;
        this.island.tilePositionX += 1;
        this.ground.tilePositionX += 1;
        
        if (this.cursors.left.isDown) {
            this.dino.x -= 5;
        }
        if (this.cursors.right.isDown) {
            this.dino.x += 5;
        }
        if (this.cursors.up.isDown) {
            this.dino.y = originalY - jumpHeight;
            this.sound.play("jump",{volume:0.1});
        } else {
            this.dino.y = originalY;
        }
    }
}

export default FirstScene;
