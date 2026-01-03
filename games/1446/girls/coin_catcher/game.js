window.onload = function () {
    //Game configuration
    const config = {
        width: 800,
        height: 400, 
        parent: 'game-container', //The HTML container for the game
        physics: {
            default: 'arcade', //Using arcade physics
            arcade: {
                gravity: { y: 300 }, //Gravity pulling objects down
                debug: false //Disable physics debugging
            }
        },
        //The game scenes
        scene: [level1, level2]  
    };

    //Initialize the game
    const game = new Phaser.Game(config);
};
