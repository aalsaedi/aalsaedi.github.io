var config = {
    width: 600,
    height: 360,
    backgroundColor: 0xebbd34,
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    scene: [StartScene, PlayScene]
};

window.onload = function () {
    var game = new Phaser.Game(config);
};
