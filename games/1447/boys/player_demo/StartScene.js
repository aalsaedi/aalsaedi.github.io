class StartScene extends Phaser.Scene {
    constructor() {
        super("StartScene");
    }

    preload() {
        
        this.load.image("bg", "assets/bg.png");
        this.load.spritesheet("boy", "assets/spritesheet.png", {
            frameWidth: 64,
            frameHeight: 64
        });
    }

    create() {
        this.add.image(300, 180, "bg");
        

        this.add.text(120, 120, "player demo", {
            font: "24px Arial",
            fill: "#000000"
        });

        this.add.text(140, 200, "Press SPACE to Start", {
            font: "18px Arial",
            fill: "#000000"
        });

        this.cursorKeys = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.cursorKeys.space.isDown) {
            this.scene.start("PlayScene");
        }
    }
}
