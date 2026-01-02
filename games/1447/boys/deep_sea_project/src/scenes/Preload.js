class PreloadScene extends Phaser.Scene {
    constructor() {
        super("PreloadScene");
    }

    preload() {
        
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(710, 515, 500, 50);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x00ffff, 1);
            progressBar.fillRect(720, 525, 480 * value, 30);
        });

       
        
        this.load.image('background', 'assets/images/menu_bg.png'); 

        
        this.load.spritesheet('bubble_sheet', 'assets/sprites/bubble_sheet.png', { 
            frameWidth: 140, 
            frameHeight: 1024 
        });

        this.load.spritesheet('diver-side', 'assets/sprites/diver-swim-side.png', { 
            frameWidth: 256, 
            frameHeight: 256 
        });

        this.load.spritesheet('diver-front', 'assets/sprites/diver-swim-front.png', { 
            frameWidth: 256, 
            frameHeight: 256 
        });
    }

    create() {
        console.log("PreloadScene: Assets loaded. Starting Menu...");
        this.scene.start("MenuScene");
    }
}

export default PreloadScene;