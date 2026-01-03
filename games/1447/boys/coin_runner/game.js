var config = {
    width: 650,
    height: 450,
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
