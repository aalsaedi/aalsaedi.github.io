//Preloader.js

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("Preloader");
  }

  preload() {
    this.add.image(400, 300, "background").setScale(2);
    

      this.loadText = this.add.text(400, 300, 'Loading ...', {
        fontSize: '80px',
        fill: '#fff',
        backgroundColor: '#000',
        padding: { x: 20, y: 10 },
    }).setOrigin(0.5);

    this.load.setPath("assets/images/");
    this.load.image("background", "space_background.png");
    this.load.image("player", "spaceship.png");
    this.load.image("coin", "coin.png");

    this.load.image("enemy1", "enemy1.png");
    this.load.image("enemy2", "enemy2.png");
    this.load.image("enemy3", "enemy3.png");
    this.load.image("bullet", "bullet.png");

    //  Audio ...
    this.load.setPath("assets/sounds/");

    this.load.audio("appear", ["appear.mp3"]);
    this.load.audio("fail", ["fail.mp3"]);
    this.load.audio("laugh", ["laugh.mp3"]);
    this.load.audio("music", ["music.mp3"]);
    this.load.audio("pickup", ["pickup.mp3"]);
    this.load.audio("start", ["start.mp3"]);
    this.load.audio("victory", ["victory.mp3"]);

    this.load.audio("appear", ["appear.ogg", "appear.m4a", "appear.mp3"]);
    this.load.audio("fail", ["fail.ogg", "fail.m4a", "fail.mp3"]);
    this.load.audio("laugh", ["laugh.ogg", "laugh.m4a", "laugh.mp3"]);
    this.load.audio("music", ["music.ogg", "music.m4a", "music.mp3"]);
    this.load.audio("pickup", ["pickup.ogg", "pickup.m4a", "pickup.mp3"]);
    this.load.audio("start", ["start.ogg", "start.m4a", "start.mp3"]);
    this.load.audio("victory", ["victory.ogg", "victory.m4a", "victory.mp3"]);

  }


  create() {
    

    this.loadText.setText("Click to Start");

    this.input.once("pointerdown", () => {
      this.scene.start("MainGame");
    });
  }
}
