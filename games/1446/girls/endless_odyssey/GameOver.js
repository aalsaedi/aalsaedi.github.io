      const setText = (scene, x, y, message, fontSize, strokeColor,
        fillColor, originX = 0, originY = 0) => scene.add.text(x, y, message, {
        fontSize,
        fill: fillColor,
        fontFamily: '"Akaya Telivigala"',
        strokeThickness: 5,
        stroke: strokeColor,
      }).setOrigin(originX, originY);

      const playStopAudio = (status, audio) => {
        if (status) {
          if (!audio.isPlaying) {
            audio.play();
          }
        } else {
          audio.stop();
        }
      };

      // Custom Buttons Class after end
      class CustomButton extends Phaser.GameObjects.Container {
        constructor(scene, x, y, firstImage, hoverImage) {
          super(scene, x, y);
      
          this.firstImage = scene.add.image(0, 0, firstImage);
          this.hoverImage = scene.add.image(0, 0, hoverImage);
      
          this.add(this.firstImage);
          this.add(this.hoverImage);
      
          this.hoverImage.setVisible(false);
      
          this.setSize(this.firstImage.width, this.firstImage.height);
      
          this.setInteractive().on('pointerover', () => {
            this.firstImage.setVisible(false);
            this.hoverImage.setVisible(true);
          }).on('pointerout', () => {
            this.firstImage.setVisible(true);
            this.hoverImage.setVisible(false);
          });
        }
      }

class GameOver extends Phaser.Scene {
    constructor() {
      super({ key: 'GameOver' });

    }
  
    create() {  
      this.add.image(gameState.sceneWidth, 0, 'sky').setScale(1);
    
      setText(this, gameState.sceneWidth / 2, gameState.sceneHeight / 4, 'GAME OVER', '60px', '#ffffff', '#ff0000', 0.5, 0.5);
    
      setText(this, gameState.sceneWidth / 2, gameState.sceneHeight / 3 + 30, `Your Score: ${gameState.score}`, '60px', '#ffffff', '#0000ff', 0.5, 0.5);
  
      // Scene Buttons
      const playAgainBtn = new CustomButton(this, gameState.sceneWidth / 2, gameState.sceneHeight / 2 + 80, 'playAgain', 'playAgainHover');
      this.add.existing(playAgainBtn);
  
      playAgainBtn.setInteractive().on('pointerover', () => {
        playStopAudio(gameState.sound, this.hoverSound);
      }).on('pointerup', () => {
        
        this.scene.start('FirstScene');
      });
    }
  }
