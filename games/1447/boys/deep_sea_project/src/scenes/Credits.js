class CreditsScene extends Phaser.Scene {
    constructor() {
        super("CreditsScene");
    }

    create() {
        
        this.add.text(960, 540, "Credits: Made by Majed\n\n(Click to Return)", { 
            fontSize: '48px',
            align: 'center',
            fill: '#ffffff'
        }).setOrigin(0.5);

        
        this.input.on('pointerdown', () => {
            this.scene.start("MenuScene");
        });
    }
}

export default CreditsScene;