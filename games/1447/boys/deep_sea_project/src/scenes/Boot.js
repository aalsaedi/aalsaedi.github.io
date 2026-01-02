class BootScene extends Phaser.Scene {
    constructor() {
        super("BootScene");
    }

    create() {

        console.log("Booting game...");
        this.scene.start("PreloadScene");
    }
}

export default BootScene;