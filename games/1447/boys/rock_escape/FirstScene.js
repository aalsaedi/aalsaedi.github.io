class FirstScene extends Phaser.Scene {
  constructor() {
    super("FirstScene");
  }

  preload() {
    //BackGround
    this.load.image("bg", "assets/img/bg.png");
    //Character
    this.load.spritesheet("Char", "assets/img/Cha.png", {
      frameWidth: 183,
      frameHeight: 276,
    });
    //Rock
    this.load.spritesheet("rock", "assets/img/Rock.png", {
      frameWidth: 185,
      frameHeight: 185,
    });
  }

  create() {
    const { width, height } = this.scale;

    // Backgroung Properities
    this.add.image(width / 2, height / 2, "bg");

    // Physics Properities
    this.platforms = this.physics.add.staticGroup();

    //Character Properities
    this.Char = this.physics.add.sprite(240, 250, "Char", 0);
    this.Char.setScale(0.09);
    // this.Char.setCollideWorldBounds(true);

    // Rocks Properities
    this.rocks = [];
    for (let i = 0; i < 3; i++) {
      const rock = this.physics.add.sprite(
        Phaser.Math.Between(100, width - 100),
        Phaser.Math.Between(-100, 0),
        "rock",
        0
      );
      rock.setScale(0.3);
      rock.body.setSize(80, 80);
      rock.body.setOffset(50, 50);

      rock.body.setAllowGravity(false);
      rock.body.setVelocity(0, 0);
      this.rocks.push(rock);
    }
    this.rocks.forEach((rock) => {
      this.physics.add.collider(this.Char, rock, () => {
        this.displayGameOver();
      });
    });

    // Camera
    this.myCam = this.cameras.main;
    this.myCam.setBounds(0, 0, width, height * 6);
    this.myCam.startFollow(this.Char);

    // Inputs
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.enterKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    // Platforms
    const platformData = [
      { x: 130, y: 290, w: 280 },
      { x: 105, y: 230, w: 220 },
      { x: 500, y: 220, w: 450 },
      { x: 455, y: 160, w: 150 },
      { x: 460, y: 115, w: 100 },
      { x: 600, y: 85, w: 110 },
      { x: 415, y: 40, w: 110 },
      { x: 415, y: 35, w: 110 },
    ];

    platformData.forEach((p, index) => {
      const platform = this.add.rectangle(p.x, p.y, p.w, 10, 0xffa500);
      this.physics.add.existing(platform, true);
      platform.setAlpha(0.2);
      this.platforms.add(platform);

      // Winning Platform
      if (index === 6 || index === 7) {
        this.physics.add.collider(this.Char, platform, () => this.displayWin());
      }
    });

    this.physics.add.collider(this.Char, this.platforms);

    // Win-Lose
    this.gameOver = false;
    this.win = false;

    this.gameOverText = this.add
      .text(this.cameras.main.width / 2, this.cameras.main.height / 2, "", {
        fontSize: "32px",
        color: "#ff0000",
      })
      .setOrigin(0.5)
      .setScrollFactor(0);
  }

  displayWin() {
    if (!this.win) {
      this.win = true;
      this.physics.pause();
      this.gameOverText.setColor("#00ff00");
      this.gameOverText.setText("You Win\nPress Enter to Restart");
    }
  }

  displayGameOver() {
    this.gameOver = true;
    this.physics.pause();
    this.gameOverText.setColor("#ff0000");
    this.gameOverText.setText("Game Over\nPress Enter to Retry");
  }

  moveObject(obj, speed) {
    obj.y += speed;
    obj.angle += 1;

    if (obj.y > this.physics.world.bounds.height) {
      obj.y = 0;
      obj.x = Phaser.Math.Between(0, this.scale.width);
      obj.angle = 0; // إعادة تعيين الدوران
    }
  }

  update() {
    if (this.gameOver || this.win) {
      if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
        this.scene.restart();
      }
      return;
    }

    this.rocks.forEach((rock) => {
      this.moveObject(rock, 1.5);
    });

    const ss = 100;
    this.Char.setVelocityX(0);

    if (this.cursors.left.isDown) {
      this.Char.setVelocityX(-ss);
      this.Char.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.Char.setVelocityX(ss);
      this.Char.flipX = false;
    }

    if (
      (this.cursors.up.isDown || this.spaceKey.isDown) &&
      this.Char.body.blocked.down
    ) {
      this.Char.setVelocityY(-250);
    }
  }
}
