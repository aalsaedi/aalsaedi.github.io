class endGame extends Phaser.Scene {
  constructor() {
    super("EndGame");
  }
  create({ score }) {
    this.bg = this.add.tileSprite(0, 0, config.width, config.height, "bg");
    this.bg.setOrigin(0, 0);
    this.bg.alpha = 0.5;
    this.scoreBoard = this.add
      .image(config.width / 2, config.height / 2, "scoreBoard")
      .setScale(1.3);
    this.add
      .text(config.width / 2, config.height / 2.8, `Your Score`, {
        fontSize: "40px",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5, 0);
    this.add
      .text(config.width / 2, config.height / 1.8, score, {
        fontSize: "40px",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0, 0.5);
    this.coin = this.physics.add
      .sprite(config.width / 2.2, config.height / 1.8, "coin", 1)
      .setScale(0.3);
    this.replayBtn = this.add
      .image(config.width / 2, config.height / 1.3, "replayBtn")
      .setScale(1);

    this.replayBtn.setInteractive({ cursor: "pointer" });
    this.replayBtn.on("pointerdown", () => {
      this.scene.start("PreloadGame");
    });
  }
}
