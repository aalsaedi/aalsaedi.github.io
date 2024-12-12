var config = {
  width: 600,
  height: 440,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },

  input: {
    gamepad: true,
  },

  audio: {
    noAudio: false,
  },

  scene: [preloadGame, playGame, endGame],
};
game = new Phaser.Game(config);
