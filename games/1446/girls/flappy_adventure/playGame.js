class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }
  create() {
    this.score = 0;
    this.gameStarted = false;
    this.gameOver = false;
    this.createBackground();
    this.gamePad();
    this.player = this.physics.add
      .sprite(config.width * 0.2, config.height / 2, "bird1")
      .setDepth(Infinity);
    this.player.setOrigin(0.5, 0.5);
    this.player.setScale(0.5);
    this.player.setCircle(35, 10, 0);
    this.player.body.setCollideWorldBounds(true);
    this.createAnimation();
    this.player.play("bird");

    this.coin = this.physics.add
      .sprite(config.width / 2.1, config.height * 0.95, "coin", 1)
      .setScale(0.3);
    this.scoreText = this.add
      .text(config.width / 2, config.height * 0.95, this.score, {
        fontSize: "40px",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0, 0.5);
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.myCam = this.cameras.main;
    this.myCam.setBounds(0, 0, config.width * 3, config.height);
    this.myCam.startFollow(this.player);

    this.sound.unlock();
    this.bg_audio = this.sound.add("bg_audio", { loop: true });
    this.bg_audio.setVolume(0.5);
    this.bg_audio.play();
    this.flying_audio = this.sound.add("flying_audio");
    this.lost_audio = this.sound.add("lost_sound");
    this.coin_audio = this.sound.add("coin_sound");

    this.physics.add.overlap(this.player, this.ground, () => {
      if (!this.gameOver) {
        this.lost_audio.play();
        this.bg_audio.stop();
        this.gameOver = true;
        this.gameEnd();
      }
    });
  }

  createBackground() {
    this.bg = this.add.tileSprite(0, 0, config.width, config.height, "bg");
    this.bg.setOrigin(0, 0);
    this.bg.setScrollFactor(0);
    this.bg.alpha = 0.9;
    this.ground = this.physics.add.sprite(
      100,
      config.height * 1.04,
      "devil1",
      1
    );
    this.ground.setScale(0.3);
    this.ground.setVisible(false);
  }
  createAnimation() {
    const birdFrames = [];
    for (let i = 1; i <= 2; ++i) {
      birdFrames.push({ key: `bird${i}` });
    }
    this.anims.create({
      key: "bird",
      frames: birdFrames,
      frameRate: 15,
      repeat: -1,
    });

    const devilFrames = [];
    for (let i = 1; i <= 152; ++i) {
      devilFrames.push({ key: `devil${i}` });
    }
    this.anims.create({
      key: "devilAnimation",
      frames: devilFrames,
      frameRate: 45,
      repeat: -1,
    });

    this.anims.create({
      key: "coin",
      frames: this.anims.generateFrameNumbers("coin"),
      frameRate: 10,
      repeat: -1,
    });
  }
  gamePad() {
    /***** Gamepad *****/
    this.connection_flag = false;
    this.input.gamepad.on("connected", function (gamepad, event) {
      if (this.connection_flag == false) {
        window.alert("Gamepad Connected!");
        this.connection_flag = true;
      }
    });
    this.input.gamepad.on("disconnected", function (gamepad, event) {
      if (this.connection_flag == true) {
        window.alert("Gamepad Disconnected!");
        this.connection_flag = false;
      }
    });
  }

  generateCoinAndDevil() {
    let coinY = Math.floor(Math.random() * config.height * 0.7 + 50);
    let coin = this.physics.add
      .sprite(config.width + 50, coinY, "coin", 1)
      .setScale(0.3)
      .setCircle(50);
    coin.play("coin");
    coin.setVelocityX(-100);
    let coinCollider = this.physics.add
      .sprite(config.width + 50, coinY, "coin", 1)
      .setScale(0.3)
      .setCircle(50)
      .setVisible(false);
    coinCollider.setVelocityX(-100);

    this.physics.add.overlap(this.player, coinCollider, () => {
      coinCollider.destroy();
      this.score += 1;
      this.scoreText.setText(this.score);
      this.coin_audio.play();
      this.coinTween(coin);
    });

    let devilY = Math.floor(Math.random() * config.height * 0.7 + 50);
    while (devilY < coin.y + 40 && devilY > coin.y - 40) {
      devilY = Math.floor(Math.random() * config.height * 0.7 + 50);
    }

    let devil = this.physics.add
      .sprite(config.width + 50, devilY, "coin", 1)
      .setScale(0.12)
      .setCircle(150, 100, 100);
    devil.play("devilAnimation");
    devil.setVelocityX(-100);
    this.physics.add.overlap(this.player, devil, () => {
      if (!this.gameOver) {
        this.lost_audio.play();
        this.gameOver = true;
        this.bg_audio.stop();
        this.devilTween(devil);
      }
    });

    setTimeout(() => {
      if (!this.gameOver) {
        this.generateCoinAndDevil();
      }
    }, 3000);
  }

  coinTween(coin) {
    this.tweens.add({
      targets: coin,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 300,
      ease: "Power1",
      onComplete: () => {
        coin.destroy();
      },
    });
  }
  devilTween(devil) {
    this.tweens.add({
      targets: devil,
      scaleX: 1,
      scaleY: 1,
      alpha: 0,
      duration: 500,
      ease: "Power1",
      onComplete: () => {
        devil.destroy();
        this.gameEnd();
      },
    });
  }

  update() {
    var pointer = this.input.activePointer;
    if (pointer.isDown) {
      // var touchX = pointer.x;
      // var touchY = pointer.y;
      // this.player.x = 0;
    }

    if (this.cursorKeys.right.isDown && !this.gameStarted) {
      this.flying_audio.play();
      this.gameStarted = true;
      this.player.body.setGravityY(800);
      this.generateCoinAndDevil();
    }
    if (this.cursorKeys.up.isDown && !this.gameOver) {
      this.flying_audio.play();
      this.player.setVelocityY(-250);
      if (!this.gameStarted) {
        this.gameStarted = true;
        this.player.body.setGravityY(800);
        this.generateCoinAndDevil();
      }
    }
    this.bg.tilePositionX += 1;
  }

  gameEnd() {
    this.player.body.setCollideWorldBounds(false);
    setTimeout(() => {
      this.scene.stop();
      this.scene.start("EndGame", { score: this.score });
    }, 500);
  }
}
