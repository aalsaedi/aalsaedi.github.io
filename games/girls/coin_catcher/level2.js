class level2 extends Phaser.Scene {
    constructor() {
        super("level2");
    }

    preload() {
        //Load game assets
        this.load.image('background2', 'assets/background.png'); 
        this.load.image("coin", 'assets/coin.png'); 
        this.load.image("stone", 'assets/stone.png'); 
        this.load.spritesheet("player", "https://labs.phaser.io/assets/sprites/dude.png", {
            frameWidth: 32,
            frameHeight: 48
        }); //Player sprite sheet
    }

    create() {
        //Get the width and height of the game container
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;

        //Add the background image in the center of the screen
        const background = this.add.image(gameWidth / 2, gameHeight / 2, 'background2');

        //Calculate the scale for the background to cover the entire container
        const scaleX = gameWidth / background.width;
        const scaleY = gameHeight / background.height;
        const scale = Math.max(scaleX, scaleY); //Use the larger scale to avoid gaps

        //Apply the calculated scale to the background image
        background.setScale(scale);

        //Fix the background in place so it doesn't move
        background.setScrollFactor(0);

        //Add the player sprite
        this.player = this.physics.add.sprite(400, 500, "player");
        this.player.setCollideWorldBounds(true); //Prevent the player from leaving the screen

        //Create animations for the player
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1 //Loop the animation
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "player", frame: 4 }], //Idle frame
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
        this.targetCoins = 20; //Number of coins needed to complete the level

        //UI text for level and coins
        this.levelText = this.add.text(550, 10, 'Level: 2', { fontSize: '24px', fill: '#fff' });
        this.coinsText = this.add.text(10, 10, `Coins: 0/${this.targetCoins}`, { fontSize: '24px', fill: '#fff' });

        //Create a group for coins
        this.coinGroup = this.physics.add.group();

        //Create a group for stones
        this.stoneGroup = this.physics.add.group();

        //Check for overlap between the player and coins
        this.physics.add.overlap(this.coinGroup, this.player, this.collectCoin, null, this);

        //Check for overlap between the player and stones
        this.physics.add.overlap(this.stoneGroup, this.player, this.hitStone, null, this);

        //Create keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();

        //A timer to spawn coins periodically
        this.time.addEvent({
            delay: 1000, //Spawn a coin every second
            callback: this.spawnCoin,
            callbackScope: this,
            loop: true
        });

        //A timer to spawn stones periodically
        this.time.addEvent({
            delay: 1500, //Spawn a stone every 1.5 seconds
            callback: this.spawnStone,
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

    //Function to spawn coins at random positions
    spawnCoin() {
        const x = Phaser.Math.Between(50, 750); //Generate a random x-coordinate
        const coin = this.coinGroup.create(x, 0, 'coin');
        coin.setScale(0.3); 
        coin.setVelocityY(100); //Set falling speed
    }

    //Function to spawn stones at random positions
    spawnStone() {
        const x = Phaser.Math.Between(50, 750); //Generate a random x-coordinate
        const stone = this.stoneGroup.create(x, 0, 'stone');
        stone.setScale(0.09); 
        stone.setVelocityY(150); //Set falling speed
    }

    //Function to collect a coin
    collectCoin(player, coin) {
        coin.destroy(); //Remove the coin
        this.collectedCoins++; //Increment collected coins count
        this.coinsText.setText(`Coins: ${this.collectedCoins}/${this.targetCoins}`); //Update UI

        //Check if the target number of coins has been collected
        if (this.collectedCoins >= this.targetCoins) {
            this.scene.start('level3'); // Move to Level 3
        }
    }

    //Function to handle collision with stones (Game Over scenario)
    hitStone(player, stone) {
        player.setTint(0xff0000); //Change player color to red to indicate a hit
        this.physics.pause(); //Stop all movements
        this.player.setActive(false); //Deactivate the player

        //Display "Game Over" text in the center of the screen
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Game Over!', {
            fontSize: '32px',
            fill: '#FF0000'
        }).setOrigin(0.5, 0.5); //Center the text

        //Restart the level after a delay
        this.time.delayedCall(2000, () => {
            this.scene.restart(); //Restart the current level
        });
    }
}
