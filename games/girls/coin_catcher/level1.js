class level1 extends Phaser.Scene {
    constructor() {
        super("level1");
    }

    preload() {
        //Load game assets
        this.load.image('background', 'assets/background1.png'); 
        this.load.image("coin", 'assets/coin.png'); 
        this.load.spritesheet("player", "https://labs.phaser.io/assets/sprites/dude.png", {
            frameWidth: 32,
            frameHeight: 48
        }); //Player sprite sheet
    }

    create() {
        //Game container dimensions
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;

        //Add background image in the center of the screen
        const background = this.add.image(gameWidth / 2, gameHeight / 2, 'background');

        //Calculate scale to cover the entire container
        const scaleX = gameWidth / background.width;
        const scaleY = gameHeight / background.height;
        const scale = Math.max(scaleX, scaleY); //Use the largest scale to avoid gaps

        //Apply scale to the background image
        background.setScale(scale);

        //Fix the background so it doesn't move
        background.setScrollFactor(0);

        //Add the player sprite
        this.player = this.physics.add.sprite(300, 500, "player");
        this.player.setCollideWorldBounds(true); //Prevent the player from leaving the screen

        //Player animations
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1 //Loop the animation
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "player", frame: 4 }],
            frameRate: 10
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("player", { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1 //Loop the animation
        });

        //Initialize variables
        this.collectedCoins = 0; //Number of collected coins
        this.targetCoins = 15; //Number of coins needed to complete the level

        //UI text for level and coins
        this.levelText = this.add.text(550, 10, 'Level: 1', { fontSize: '24px', fill: '#fff' });
        this.coinsText = this.add.text(10, 10, `Coins: 0/${this.targetCoins}`, { fontSize: '24px', fill: '#fff' });

        //Create a group for coins
        this.coinGroup = this.physics.add.group();

        //Check for overlap between the player and coins
        this.physics.add.overlap(this.coinGroup, this.player, this.collectCoin, null, this);

        //Create keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();

        //A timer to spawn coins periodically
        this.time.addEvent({
            delay: 1000, //Spawn a coin every second
            callback: this.spawnCoin,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        //Handle player movement and animations
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160); //Move left
            this.player.anims.play("left", true); //Play left animation
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160); //Move right
            this.player.anims.play("right", true); //Play right animation
        } else {
            this.player.setVelocityX(0); //Stop moving
            this.player.anims.play("turn"); //Play idle animation
        }
    }

    spawnCoin() {
        //Generate a random x-coordinate for the coin
        const x = Phaser.Math.Between(50, 750);
        
        //Create a coin and make it fall down
        const coin = this.coinGroup.create(x, 0, 'coin');
        coin.setVelocityY(100); //Set falling speed
        coin.setScale(0.3); //Scale down the coin size
    }

    collectCoin(player, coin) {
        //Destroy the collected coin
        coin.destroy();

        //Increment the number of collected coins
        this.collectedCoins++;

        //Update the coin text UI
        this.coinsText.setText(`Coins: ${this.collectedCoins}/${this.targetCoins}`);

        //Check if the target number of coins has been collected
        if (this.collectedCoins >= this.targetCoins) {
            //Display "You Win" message in the center of the screen
            this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'You Win! Level 1 Complete', {
                fontSize: '32px',
                fill: '#00FF00'
            }).setOrigin(0.5, 0.5); //Center the text

            //Wait for 2 seconds before starting the next level
            this.time.delayedCall(2000, () => {
                this.scene.start('level2'); //Go to Level 2
            });
        }
    }
}
