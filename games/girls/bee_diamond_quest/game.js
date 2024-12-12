// Game configuration object
var config = {
    type: Phaser.AUTO,
    width: 600,
    height: 450,
    scene: [PreloadGame, PlayGame],
    // Physics configuration (arcade physics for basic 2D physics)
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
  };
// Create a new Phaser game instance with the given configuration 
var game = new Phaser.Game(config);
  
  