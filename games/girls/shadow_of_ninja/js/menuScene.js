export default class MenuScene extends Phaser.Scene {
    constructor() {
      super({ key: 'MenuScene' });
    }
  
    preload() {
      this.load.image('menubg', 'assets/menubg.jpg'); 
      this.load.image('play', 'assets/play.png');     
    }
  
    create() {
      this.add.image(0, 0, 'menubg').setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);
  
      const playButton = this.add.image(this.scale.width / 2, this.scale.height / 2 + 50, 'play').setOrigin(0.5);
      playButton.setInteractive();
  
      playButton.on('pointerdown', () => {
        this.scene.start('GameScene'); 
      });
    }
  }
  