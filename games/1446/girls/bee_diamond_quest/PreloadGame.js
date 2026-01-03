class PreloadGame extends Phaser.Scene {
    constructor() {
        super("PreloadGame");
    }
  
    preload() {
        // Load the assets
        this.load.image("background", "assets/background.jpg");  // Background image
        this.load.image("diamond", "assets/diamond.png");        // Diamond image
        this.load.image("stone", "assets/stone.png");            // Stone image
        this.load.spritesheet("bee", "assets/bee.png", { frameWidth: 37, frameHeight: 37 });  // Bee sprite sheet with specified frame size
  
        // Load the audio files
        this.load.audio("backgroundMusic", "assets/background.mp3");  // Background music
        this.load.audio("winSound", "assets/win.mp3");                // Win sound effect
        this.load.audio("loseSound", "assets/lose.mp3");              // Lose sound effect
    }
  
    create() {
        // Start the game scene after assets are loaded
        this.scene.start("PlayGame");
    }
  }
  