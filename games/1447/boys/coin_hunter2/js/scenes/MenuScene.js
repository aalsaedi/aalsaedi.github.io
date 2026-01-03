class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        this.load.image('bg', 'assets/images/bg.png');
        this.load.image('ground-img', 'assets/images/ground.png');
        this.load.image('player', 'assets/sprites/character/idle.gif');
        this.load.image('player-run', 'assets/sprites/character/run.gif');
        this.load.image('player-jump', 'assets/sprites/character/jump.png');
        this.load.spritesheet('coin', 'assets/sprites/coin1_16x16.png', { 
            frameWidth: 16, 
            frameHeight: 16 
        });
        this.load.image('spike', 'assets/images/spike.png');
        this.load.audio('coin-sfx', 'assets/audio/coin.mp3');
        this.load.audio('bg-music', 'assets/audio/background.mp3');
    }

    create() {
        this.anims.create({
            key: 'spin',
            frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 14 }),
            frameRate: 15,
            repeat: -1
        });

        const width = this.scale.width;
        const height = this.scale.height;
        
        this.add.image(width * 0.5, height * 0.5, 'bg').setDisplaySize(width, height);

        this.add.text(400, 200, 'COIN HUNTER', {
            fontSize: '64px',
            fill: '#fff',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(400, 350, 'Press SPACE to Start', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
    }
}