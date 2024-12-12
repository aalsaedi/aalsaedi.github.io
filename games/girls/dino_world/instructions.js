class instructions extends Phaser.Scene{
    constructor(){
      super("Instructions");
    }
    preload() {
        this.load.image("bg_Start", "assets/bg_instructions.png");
    }

    create(){
      this.scene.start("instructions");
    }
}
