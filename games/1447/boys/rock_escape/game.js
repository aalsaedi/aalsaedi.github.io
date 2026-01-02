var config = {
  type: Phaser.AUTO,
  width: 600,
  height: 360,
  //   backgroundColor: 0x000000,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      debug: false,
    },
  },
  scene: [FirstScene],
};

window.onload = function () {
  var game = new Phaser.Game(config);
};
