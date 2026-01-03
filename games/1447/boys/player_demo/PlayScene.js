class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene");
    }
    fixCoinSize(coin, targetSize = 32) {
    // targetSize = the final width & height you want for all coins
    let originalWidth = coin.width;
    let originalHeight = coin.height;

    let scaleX = targetSize / originalWidth;
    let scaleY = targetSize / originalHeight;

    // Use the smaller scale to keep aspect ratio correct
    let finalScale = Math.min(scaleX, scaleY);

    coin.setScale(finalScale);
}


    preload() {
        // Load backgrounds (any size allowed)
        this.load.image("bg1", "assets/bg1.jpg");
        this.load.image("bg2", "assets/bg2.jpg");  // Optional
        this.load.image("bg3", "assets/bg3.jpg");  // Optional

        // Player + Coins
        this.load.spritesheet("boy", "assets/spritesheet.png", {
            frameWidth: 64,
            frameHeight: 64
        });

        this.load.image("coin", "assets/coin.png");
    }

    // Scale ANY background to fill the screen completely
    scaleBackground(img) {
        let bgWidth = img.width;
        let bgHeight = img.height;

        let scaleX = config.width / bgWidth;
        let scaleY = config.height / bgHeight;

        let scale = Math.max(scaleX, scaleY);  // Full coverage

        img.setScale(scale);
        img.setScrollFactor(0);
    }

    collectCoin(player, coin) {
        this.cameras.main.shake(120, Phaser.Math.FloatBetween(0.002, 0.01));

        this.score += 1;
        this.scoreText.setText("Score: " + this.score);

        // Respawn coin randomly
        coin.enableBody(true,
            Phaser.Math.Between(50, 550),
            Phaser.Math.Between(50, 300),
            true, true
        );
        this.fixCoinSize(coin, 32);
    }

    create() {
        // CAMERA
        this.myCam = this.cameras.main;
        this.myCam.setBounds(0, 0, config.width, config.height);

        // INPUT
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // RANDOM BACKGROUND
        let bgChoices = ["bg1", "bg2", "bg3"];
        let chosenBG = Phaser.Math.RND.pick(bgChoices);

        let bg = this.add.image(0, 0, chosenBG).setOrigin(0, 0);
        this.scaleBackground(bg);  // Apply auto-scaling

        // SCORE
        this.score = 0;
        this.scoreText = this.add.text(10, 40, "Score: 0", {
            font: "16px Arial",
            fill: "#ffffff"
        }).setScrollFactor(0);

        // RANDOM PLAYER START POSITION
        let startX = Phaser.Math.Between(50, 550);
        let startY = Phaser.Math.Between(50, 300);

        this.boy = this.physics.add.sprite(startX, startY, "boy");
        this.boy.setCollideWorldBounds(true);
        this.boy.setBounce(0.5);

        this.createAnimations();
        this.boy.play("move");

        // RANDOM NUMBER OF COINS (3–10)
        this.coins = this.physics.add.group();
        let coinCount = Phaser.Math.Between(3, 10);

        for (let i = 0; i < coinCount; i++) {
            let x = Phaser.Math.Between(50, 550);
            let y = Phaser.Math.Between(50, 300);
            let coin = this.coins.create(x, y, "coin");
            this.fixCoinSize(coin, 32);   // Make every coin exactly 32px

        }

        this.physics.add.overlap(this.boy, this.coins, this.collectCoin, null, this);

        // CAMERA FOLLOW
        this.myCam.startFollow(this.boy);

        // ESC TEXT
        this.add.text(10, 10, "Press ESC to return", {
            font: "16px Arial",
            fill: "#ffffff"
        }).setScrollFactor(0);
    }

    createAnimations() {
        this.anims.create({
            key: "move",
            frames: this.anims.generateFrameNumbers("boy", { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
    }

    update() {
        // HORIZONTAL MOVEMENT
        if (this.cursorKeys.left.isDown) {
            this.boy.setVelocityX(-120);
        } else if (this.cursorKeys.right.isDown) {
            this.boy.setVelocityX(120);
        } else {
            this.boy.setVelocityX(0);
        }

        // VERTICAL MOVEMENT
        if (this.cursorKeys.up.isDown) {
            this.boy.setVelocityY(-120);
        } else if (this.cursorKeys.down.isDown) {
            this.boy.setVelocityY(120);
        } else {
            this.boy.setVelocityY(0);
        }

        // RANDOM BOOST
        if (this.cursorKeys.space.isDown) {
            let boostX = Phaser.Math.Between(120, 200);
            let boostY = Phaser.Math.Between(120, 200);
            this.boy.setVelocity(boostX, boostY);
        }

        // STOP completely
        if (this.cursorKeys.shift.isDown) {
            this.boy.setVelocity(0, 0);
        }

        // RETURN TO MENU
        if (this.keyESC.isDown) {
            this.scene.start("StartScene");
        }
    }
}
