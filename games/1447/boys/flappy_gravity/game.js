const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 400,
  parent: "game-container",
  physics: { default: "arcade", arcade: { debug: false } },
  scene: [PreloadGame, PlayGame]
};
const game = new Phaser.Game(config);
