class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        this.finalScore = data.score || 0;
        this.isWin = data.win;
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;
        
        this.add.image(width * 0.5, height * 0.5, 'bg').setDisplaySize(width, height);

        const titleText = this.isWin ? 'YOU WIN!' : 'GAME OVER';
        const titleColor = this.isWin ? '#fff' : '#ff0000';

        this.add.text(400, 200, titleText, {
            fontSize: '64px',
            fill: titleColor,
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(400, 300, 'Final Score: ' + this.finalScore, {
            fontSize: '48px',
            fill: '#fff',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.add.text(400, 450, 'Press SPACE to Restart', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
    }
}