// حالة اللاعب
window.GameState = {
    currentScene: null
};

window.onload = function(){
    var config = {
        width:1200,
        height:600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 2500 },
                debug: false
            }
        },
        scene:[MenuScene,TutorialScene,FirstScene,SecondScene,DeathScene]
    }

    var game = new Phaser.Game(config);

}