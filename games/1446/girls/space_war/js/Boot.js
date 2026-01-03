export default class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Set the path for images
        this.load.setPath('assets/images/');

        // Load background and font assets
        this.load.image('background', 'background3.jpg');
        this.load.bitmapFont('slime', 'slime-font.png', 'slime-font.xml');
    }

    create() {
        // Initialize high score in the registry if it doesn't exist
        if (!this.registry.has('highscore')) {
            this.registry.set('highscore', 0);
        }

        // Transition to the Preloader scene
        this.scene.start('Preloader');
    }
}
