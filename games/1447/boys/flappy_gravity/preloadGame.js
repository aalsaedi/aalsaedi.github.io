class PreloadGame extends Phaser.Scene {
  constructor() { super("preloadGame"); }

  preload() {
    this.load.image("bg", "assets/bg.png");
    this.load.image("ground", "assets/ground.png");
    this.load.image("obstacle", "assets/obstacle.png");
    this.load.spritesheet("player", "assets/player_sheet.png", { frameWidth: 32, frameHeight: 32 });
    this.load.audio("flip", "assets/flip.wav");
    this.load.audio("bg_audio", "assets/bg_audio.wav"); 
  }

  create() { this.scene.start("playGame"); }
}
