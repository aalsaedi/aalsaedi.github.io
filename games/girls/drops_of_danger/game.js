
var config = {
    type: Phaser.AUTO,
    width: 900,
    height: 649,
    backgroundColor: 0xebbd34,
    scene: [Scene],

    physics: {
        default: "arcade",
        arcade:{
            debug: false,
            gravity: { y: 0 }, 
            debug: false 
        }
      }
}
    var game = new Phaser.Game(config);


    