class preloadGame extends Phaser.Scene {
  constructor() {
    super("PreloadGame");
  }
  preload() {
    this.load.image("bg", "assets/bg.jpg");
    this.load.image("bird1", "assets/player/bird-1.png");
    this.load.image("bird2", "assets/player/bird-2.png");
    this.load.image("playBtn", "assets/playBtn.png");
    this.load.image("scoreBoard", "assets/scoreBoard.png");
    this.load.image("replayBtn", "assets/replayBtn.png");
    this.load.image("homeBtn", "assets/homeBtn.png");

    for (let i = 1; i <= 152; ++i) {
      this.load.image(
        `devil${i}`,
        `assets/Devil Emoji/fd1abf7e-069b-42d6-8022-72baf150dc66-${i - 1}.png`
      );
    }

    this.load.spritesheet("coin", "assets/coin.png", {
      frameWidth: 100,
      frameHeight: 100,
    });

    this.load.audio("bg_audio", "assets/bg_audio.mp3");
    this.load.audio("flying_audio", "assets/flying_audio.wav");
    this.load.audio("lost_sound", "assets/lost.mp3");
    this.load.audio("coin_sound", "assets/coin.wav");
  }
  create() {
    this.bg = this.add.tileSprite(0, 0, config.width, config.height, "bg");
    this.bg.setOrigin(0, 0);
    this.bg.alpha = 0.5;
    this.bird = this.physics.add
      .sprite(config.width / 2, config.height / 2.5, "bird1", 1)
      .setScale(0.9);

    const flyFrame = [];
    for (let i = 1; i <= 2; ++i) {
      flyFrame.push({ key: `bird${i}` });
    }
    this.anims.create({
      key: "birdFly",
      frames: flyFrame,
      frameRate: 10,
      repeat: -1,
    });
    this.bird.play("birdFly");
    this.playBtn = this.physics.add
      .sprite(config.width / 2, config.height / 1.5, "playBtn")
      .setOrigin(0.5, 0.5)
      .setScale(0.8, 1)
      .setDepth(3);
    this.playBtn.setInteractive({ cursor: "pointer" });
    this.playBtnText = this.add
      .text(config.width / 2, config.height / 1.5, "Play", {
        fontSize: 30,
        color: "#fff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0.5)
      .setDepth(4)
      .setScale(1);

    let scoreBoxOn = false;
    this.playBtn.on("pointerdown", () => {
      this.bird.destroy();
      if (!scoreBoxOn) {
        let scoreBoard = this.add
          .image(config.width / 2, config.height / 2, "scoreBoard")
          .setScale(2, 1.3);
        this.playBtnText.setText("Start");
        this.add
          .text(
            config.width / 2,
            config.height / 3,
            "Collect the Coins.\nBe aware of devils.\n     Let's Play",
            {
              fontSize: "30px",
              fontStyle: "bold",
            }
          )
          .setOrigin(0.5, 0);
        scoreBoxOn = true;
      } else {
        this.sound.stopAll();
        this.scene.start("PlayGame");
      }
    });
  }
}
