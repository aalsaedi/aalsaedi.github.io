
const scenes = [
    PlayScene 
];


const config = {
    type: Phaser.AUTO, 
    width: 800, 
    height: 600, 
    parent: 'game-container', 
    scene: scenes,
    
    physics: {
        default: 'arcade', 
        arcade: {
            gravity: { y: 500 }, 
            debug: false 
        }
    }
};

// 3. إنشاء نسخة اللعبة
const game = new Phaser.Game(config);