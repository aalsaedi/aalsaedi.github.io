class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        this.load.image('background', 'assets/country-platform-preview.png');
        this.load.audio('backgroundMusic', 'assets/Juhani Junkala [Chiptune Adventures] 1. Stage 1.ogg'); // تحميل الصوت

    }

    create() {
        this.add.image(400, 300, 'background').setOrigin(0.5, 0.5).setScale(2.7);

        const startButton = this.add.text(400, 300, 'START', {
            fontSize: '48px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 },
        })
            .setOrigin(0.5)
            .setInteractive();

        startButton.on('pointerdown', () => {
            this.sound.play('backgroundMusic', { loop: true }); 
            this.scene.start('GameScene'); 
           
        this.scene.start('GameScene', { backgroundMusic });
        });
    }
}
