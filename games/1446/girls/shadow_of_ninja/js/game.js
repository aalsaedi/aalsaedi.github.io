import MenuScene from './menuScene.js';
import GameScene from './GameScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 400,
  backgroundColor: '#FFFFFF',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  },
  scene: [MenuScene, GameScene]  
};

const game = new Phaser.Game(config);

export default game;





  
  
  
  
  
  
  
  
  