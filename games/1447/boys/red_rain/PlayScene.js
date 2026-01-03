class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene");
    }

    fixCoinSize(coin, targetSize = 32) {
        let originalWidth = coin.width;
        let originalHeight = coin.height;
        let scaleX = targetSize / originalWidth;
        let scaleY = targetSize / originalHeight;
        let finalScale = Math.min(scaleX, scaleY);
        coin.setScale(finalScale);
    }

    preload() {
        // Load backgrounds
        this.load.image("bg1", "assets/background1.jpg");
        this.load.image("bg2", "assets/background2.jpg");

        // Player + Coins
        this.load.spritesheet("boy", "assets/player.png", {
            frameWidth: 32,
            frameHeight: 64
        });

        this.load.image("coin", "assets/coin.png");
    }

    scaleBackground(img) {
        let bgWidth = img.width;
        let bgHeight = img.height;
        let scaleX = config.width / bgWidth;
        let scaleY = config.height / bgHeight;
        let scale = Math.max(scaleX, scaleY);
        img.setScale(scale);
        img.setScrollFactor(0);
    }

    collectCoin(player, coin) {
        if (this.isDead || this.hasWon) return; // منع جمع العملات بعد الموت أو الفوز
        
        this.cameras.main.shake(120, Phaser.Math.FloatBetween(0.002, 0.01));
        this.score += 1;
        this.scoreText.setText("Score: " + this.score + " / 50");

        // التحقق من الفوز
        if (this.score >= 50) {
            this.winGame();
            return;
        }

        // Respawn coin randomly
        coin.enableBody(true,
            Phaser.Math.Between(50, 550),
            Phaser.Math.Between(50, 300),
            true, true
        );
        this.fixCoinSize(coin, 32);
    }

    hitLaser(player, laser) {
        if (this.isDead) return;
        
        this.isDead = true;
        
        // إيقاف حركة اللاعب
        this.boy.setVelocity(0, 0);
        this.boy.setTint(0xff0000);
        
        // إيقاف الليزرات
        this.lasers.children.entries.forEach(l => l.setVelocityY(0));
        
        // تأثير الكاميرا
        this.cameras.main.shake(500, 0.02);
        this.cameras.main.flash(300, 255, 0, 0);
        
        // عرض شاشة الموت
        this.showDeathScreen();
    }

    showDeathScreen() {
        // خلفية شفافة سوداء
        let overlay = this.add.rectangle(
            config.width / 2,
            config.height / 2,
            config.width,
            config.height,
            0x000000,
            0.7
        ).setScrollFactor(0);

        // نص "You Died!"
        let deathText = this.add.text(
            config.width / 2,
            config.height / 2 - 40,
            "YOU DIED!",
            {
                font: "48px Arial",
                fill: "#ff0000",
                stroke: "#000000",
                strokeThickness: 6
            }
        ).setOrigin(0.5).setScrollFactor(0);

        // عرض النتيجة النهائية
        let finalScore = this.add.text(
            config.width / 2,
            config.height / 2 + 20,
            "Score: " + this.score + " / 50",
            {
                font: "24px Arial",
                fill: "#ffffff"
            }
        ).setOrigin(0.5).setScrollFactor(0);

        // زر "Try Again"
        let tryAgainBtn = this.add.text(
            config.width / 2,
            config.height / 2 + 70,
            "[ Press SPACE to Try Again ]",
            {
                font: "18px Arial",
                fill: "#ffff00"
            }
        ).setOrigin(0.5).setScrollFactor(0);

        // تأثير وميض للزر
        this.tweens.add({
            targets: tryAgainBtn,
            alpha: 0.3,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // تفعيل زر المحاولة مرة أخرى
        this.canRestart = true;
    }

    winGame() {
        this.hasWon = true;
        
        // إيقاف حركة اللاعب
        this.boy.setVelocity(0, 0);
        this.boy.setTint(0x00ff00); // لون أخضر للفوز
        
        // إيقاف الليزرات
        this.lasers.children.entries.forEach(l => l.setVelocityY(0));
        if (this.laserTimer) {
            this.laserTimer.remove();
        }
        
        // تأثير الكاميرا
        this.cameras.main.flash(500, 0, 255, 0); // فلاش أخضر
        
        // عرض شاشة الفوز
        this.showWinScreen();
    }

    showWinScreen() {
        // خلفية شفافة ذهبية
        let overlay = this.add.rectangle(
            config.width / 2,
            config.height / 2,
            config.width,
            config.height,
            0x000000,
            0.7
        ).setScrollFactor(0);

        // نص "You Win!"
        let winText = this.add.text(
            config.width / 2,
            config.height / 2 - 50,
            "🎉 YOU WIN! 🎉",
            {
                font: "52px Arial",
                fill: "#00ff00",
                stroke: "#ffff00",
                strokeThickness: 6
            }
        ).setOrigin(0.5).setScrollFactor(0);

        // تأثير حركة للنص
        this.tweens.add({
            targets: winText,
            scale: 1.1,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // عرض النتيجة النهائية
        let finalScore = this.add.text(
            config.width / 2,
            config.height / 2 + 20,
            "Final Score: 50 / 50",
            {
                font: "24px Arial",
                fill: "#ffffff",
                stroke: "#000000",
                strokeThickness: 3
            }
        ).setOrigin(0.5).setScrollFactor(0);

        // زر "Play Again"
        let playAgainBtn = this.add.text(
            config.width / 2,
            config.height / 2 + 70,
            "[ Press SPACE to Play Again ]",
            {
                font: "18px Arial",
                fill: "#ffff00"
            }
        ).setOrigin(0.5).setScrollFactor(0);

        // زر العودة للقائمة
        let menuBtn = this.add.text(
            config.width / 2,
            config.height / 2 + 100,
            "[ Press ESC for Main Menu ]",
            {
                font: "16px Arial",
                fill: "#aaaaaa"
            }
        ).setOrigin(0.5).setScrollFactor(0);

        // تأثير وميض للزر
        this.tweens.add({
            targets: playAgainBtn,
            alpha: 0.3,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // تفعيل زر المحاولة مرة أخرى
        this.canRestart = true;
    }

    createLasers() {
        // مجموعة الليزرات
        this.lasers = this.physics.add.group();

        // إنشاء ليزر كل 2 ثانية
        this.laserTimer = this.time.addEvent({
            delay: 2000,
            callback: this.spawnLaser,
            callbackScope: this,
            loop: true
        });
    }

    spawnLaser() {
        if (this.isDead) return;

        // موقع عشوائي على المحور X
        let x = Phaser.Math.Between(50, 550);
        
        // رسم الليزر (مستطيل أحمر طويل)
        let laser = this.add.graphics();
        laser.fillStyle(0xff0000, 1);
        laser.fillRect(0, 0, 8, config.height);
        
        // تحويل Graphics إلى Texture
        laser.generateTexture('laser', 8, config.height);
        laser.destroy();
        
        // إضافة الليزر للفيزياء
        let laserSprite = this.lasers.create(x, -50, 'laser');
        laserSprite.setVelocityY(150);
        laserSprite.setAlpha(0.8);
        
        // تأثير توهج
        this.tweens.add({
            targets: laserSprite,
            alpha: 0.5,
            duration: 300,
            yoyo: true,
            repeat: -1
        });
    }

    create() {
        this.isDead = false;
        this.hasWon = false;
        this.canRestart = false;

        // CAMERA
        this.myCam = this.cameras.main;
        this.myCam.setBounds(0, 0, config.width, config.height);

        // INPUT
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // RANDOM BACKGROUND
        let bgChoices = ["bg1", "bg2"];
        let chosenBG = Phaser.Math.RND.pick(bgChoices);
        let bg = this.add.image(0, 0, chosenBG).setOrigin(0, 0);
        this.scaleBackground(bg);

        // SCORE مع عرض الهدف
        this.score = 0;
        this.scoreText = this.add.text(10, 40, "Score: 0 / 50", {
            font: "20px Arial",
            fill: "#ffffff",
            stroke: "#000000",
            strokeThickness: 4
        }).setScrollFactor(0);

        // عرض الهدف
        this.add.text(10, 65, "Goal: Reach 50 points!", {
            font: "14px Arial",
            fill: "#ffff00",
            stroke: "#000000",
            strokeThickness: 3
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
            this.fixCoinSize(coin, 32);
        }

        this.physics.add.overlap(this.boy, this.coins, this.collectCoin, null, this);

        // إنشاء الليزرات
        this.createLasers();

        // التصادم مع الليزر = الموت
        this.physics.add.overlap(this.boy, this.lasers, this.hitLaser, null, this);

        // CAMERA FOLLOW
        this.myCam.startFollow(this.boy);

        // ESC TEXT
        this.add.text(10, 10, "Press ESC to return", {
            font: "16px Arial",
            fill: "#ffffff",
            stroke: "#000000",
            strokeThickness: 3
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
        // إذا اللاعب مات أو فاز
        if (this.isDead || this.hasWon) {
            // إعادة المحاولة بالضغط على SPACE
            if (this.canRestart && this.cursorKeys.space.isDown) {
                this.scene.restart();
            }
            // العودة للقائمة الرئيسية
            if (this.hasWon && this.keyESC.isDown) {
                this.scene.start("StartScene");
            }
            return;
        }

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

        // حذف الليزرات التي خرجت من الشاشة
        this.lasers.children.entries.forEach(laser => {
            if (laser.y > config.height + 100) {
                laser.destroy();
            }
        });
    }
}
