export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  //Loading Bar
  preload() {
    const { width, height } = this.scale;

    // progress box
    const box = this.add.rectangle(width / 2, height / 2, 320, 40)
      .setStrokeStyle(2, 0xffffff);

    // progress bar
    const bar = this.add.rectangle(
      width / 2 - 160,
      height / 2,
      0,
      30,
      0xffffff
    ).setOrigin(0, 0.5);

    // loading text
    this.add.text(width / 2, height / 2 - 50, "Loading...", {
      fontSize: "20px",
      color: "#ffffff",
    }).setOrigin(0.5);

    // update bar
    this.load.on("progress", (value) => {
      bar.width = 320 * value;
    });

    // clean up
    this.load.on("complete", () => {
      box.destroy();
      bar.destroy();
    });

    // ✅ Background image
    this.load.image("sky", "./src/assets/cave3.jpg");
    this.load.image("menuBG", "./src/assets/menuPic.png");


    // Player spritesheet
    this.load.spritesheet("player", "src/assets/player.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
      this.load.image('bullet', 'src/assets/bullet.png');

    this.load.audio('fire', 'src/assets/Sounds/jump.wav'); 
    this.load.audio('bgMusic', 'src/assets/Sounds/background.mp3');

    // this.load.image('something', 'assets/something.png')
  }

create() {


  
  // Use make.graphics(add:false) so nothing is drawn to the screen
  const g = this.make.graphics({ x: 0, y: 0, add: false });

  // -------------------------
  // Helpers
  // -------------------------
  const stonePlatform = (key, W = 200, H = 40) => {
    g.clear();

    // base
    g.fillStyle(0x6b6b6b, 1);
    g.fillRoundedRect(0, 0, W, H, 10);

    // top highlight
    g.fillStyle(0x8a8a8a, 1);
    g.fillRoundedRect(0, 0, W, 12, 10);

    // bottom shadow
    g.fillStyle(0x4f4f4f, 1);
    g.fillRoundedRect(0, H - 12, W, 12, 10);

    // noise
    g.fillStyle(0x7a7a7a, 0.3);
    for (let i = 0; i < 40; i++) {
      g.fillCircle(
        Phaser.Math.Between(0, W),
        Phaser.Math.Between(0, H),
        Phaser.Math.Between(1, 3)
      );
    }

    // cracks
    g.lineStyle(1, 0x555555, 0.6);
    for (let i = 0; i < 5; i++) {
      g.beginPath();
      g.moveTo(Phaser.Math.Between(0, W), Phaser.Math.Between(0, H));
      g.lineTo(Phaser.Math.Between(0, W), Phaser.Math.Between(0, H));
      g.strokePath();
    }

    // outline
    g.lineStyle(2, 0x3a3a3a, 1);
    g.strokeRoundedRect(0, 0, W, H, 10);

    g.generateTexture(key, W, H);
  };

  const icePlatform = (key, W = 200, H = 40) => {
    g.clear();

    // base
    g.fillStyle(0x7cc6ff, 1);
    g.fillRoundedRect(0, 0, W, H, 10);

    // top highlight
    g.fillStyle(0xa6dcff, 1);
    g.fillRoundedRect(0, 0, W, 12, 10);

    // bottom shadow
    g.fillStyle(0x4a9fd6, 1);
    g.fillRoundedRect(0, H - 12, W, 12, 10);

    // sparkly noise
    g.fillStyle(0xffffff, 0.18);
    for (let i = 0; i < 25; i++) {
      g.fillCircle(
        Phaser.Math.Between(0, W),
        Phaser.Math.Between(0, H),
        Phaser.Math.Between(1, 3)
      );
    }

    // outline
    g.lineStyle(2, 0x2f6f99, 0.9);
    g.strokeRoundedRect(0, 0, W, H, 10);

    g.generateTexture(key, W, H);
  };

  const spikesStrip = (key, W = 200, H = 32, spikesCount = 10) => {
    g.clear();

    const spikeW = W / spikesCount;

    // base bar
    g.fillStyle(0x2b2b2b, 1);
    g.fillRect(0, H - 6, W, 6);

    for (let i = 0; i < spikesCount; i++) {
      const x = i * spikeW;

      // spike body
      g.fillStyle(0xd6d6d6, 1);
      g.beginPath();
      g.moveTo(x, H);
      g.lineTo(x + spikeW / 2, 2);
      g.lineTo(x + spikeW, H);
      g.closePath();
      g.fillPath();

      // highlight
      g.lineStyle(1, 0xffffff, 0.7);
      g.beginPath();
      g.moveTo(x + spikeW / 2, 2);
      g.lineTo(x + spikeW / 2, H);
      g.strokePath();

      // outline
      g.lineStyle(1, 0x1a1a1a, 1);
      g.beginPath();
      g.moveTo(x, H);
      g.lineTo(x + spikeW / 2, 2);
      g.lineTo(x + spikeW, H);
      g.strokePath();
    }

    g.generateTexture(key, W, H);
  };

  const spikyStonePlatform = (key) => {
    g.clear();

    const BODY_W = 200;
    const BODY_H = 40;
    const PAD = 10; // space for spikes around

    const TEX_W = BODY_W + PAD * 2;
    const TEX_H = BODY_H + PAD * 2;

    const bx = PAD;
    const by = PAD;

    // stone base
    g.fillStyle(0x6b6b6b, 1);
    g.fillRoundedRect(bx, by, BODY_W, BODY_H, 10);

    g.fillStyle(0x8a8a8a, 1);
    g.fillRoundedRect(bx, by, BODY_W, 12, 10);

    g.fillStyle(0x4f4f4f, 1);
    g.fillRoundedRect(bx, by + BODY_H - 12, BODY_W, 12, 10);

    g.fillStyle(0x7a7a7a, 0.3);
    for (let i = 0; i < 40; i++) {
      g.fillCircle(
        bx + Phaser.Math.Between(0, BODY_W),
        by + Phaser.Math.Between(0, BODY_H),
        Phaser.Math.Between(1, 3)
      );
    }

    g.lineStyle(2, 0x3a3a3a, 1);
    g.strokeRoundedRect(bx, by, BODY_W, BODY_H, 10);

    // spikes all around
    const SPIKE = 8;   // spike length
    const STEP = 16;   // spacing

    g.fillStyle(0xd6d6d6, 1);
    g.lineStyle(1, 0x1a1a1a, 1);

    // Top
    for (let x = bx + 8; x <= bx + BODY_W - 8; x += STEP) {
      g.beginPath();
      g.moveTo(x, by);
      g.lineTo(x + STEP / 2, by - SPIKE);
      g.lineTo(x + STEP, by);
      g.closePath();
      g.fillPath();
      g.strokePath();
    }
    // Bottom
    for (let x = bx + 8; x <= bx + BODY_W - 8; x += STEP) {
      g.beginPath();
      g.moveTo(x, by + BODY_H);
      g.lineTo(x + STEP / 2, by + BODY_H + SPIKE);
      g.lineTo(x + STEP, by + BODY_H);
      g.closePath();
      g.fillPath();
      g.strokePath();
    }
    // Left
    for (let y = by + 8; y <= by + BODY_H - 8; y += STEP) {
      g.beginPath();
      g.moveTo(bx, y);
      g.lineTo(bx - SPIKE, y + STEP / 2);
      g.lineTo(bx, y + STEP);
      g.closePath();
      g.fillPath();
      g.strokePath();
    }
    // Right
    for (let y = by + 8; y <= by + BODY_H - 8; y += STEP) {
      g.beginPath();
      g.moveTo(bx + BODY_W, y);
      g.lineTo(bx + BODY_W + SPIKE, y + STEP / 2);
      g.lineTo(bx + BODY_W, y + STEP);
      g.closePath();
      g.fillPath();
      g.strokePath();
    }

    g.generateTexture(key, TEX_W, TEX_H);
  };

  const bulletTexture = (key = "bullet", W = 10, H = 4) => {
    g.clear();
    g.fillStyle(0xff0000, 1);
    g.fillRect(0, 0, W, H);
    g.generateTexture(key, W, H);
  };

  
   // =========================
// ICE WALL TILE (64x64) - repeats nicely
// =========================
g.clear();

const W = 64;
const H = 64;

g.fillStyle(0x7cc6ff, 1);
g.fillRoundedRect(0, 0, W, H, 8);

// glossy highlight
g.fillStyle(0xffffff, 0.18);
g.fillRoundedRect(6, 6, W - 12, 14, 7);

// subtle cracks
g.lineStyle(1, 0xffffff, 0.12);
for (let i = 0; i < 6; i++) {
  g.beginPath();
  g.moveTo(Phaser.Math.Between(0, W), Phaser.Math.Between(0, H));
  g.lineTo(Phaser.Math.Between(0, W), Phaser.Math.Between(0, H));
  g.strokePath();
}

g.lineStyle(2, 0x2f6f99, 0.9);
g.strokeRoundedRect(0, 0, W, H, 8);

g.generateTexture("ice_wall_tile", W, H);


// highlight stripe
g.fillStyle(0xffffff, 0.25);
g.fillRoundedRect(5, 5, 190, 10, 8);

g.generateTexture('platform_ice2', 200, 40);

  // -------------------------
  // Generate textures
  // -------------------------
  stonePlatform("platform_stone", 200, 40);
  icePlatform("platform_ice", 200, 40);
  spikyStonePlatform("spike");
  spikesStrip("spikes", 200, 32, 10);
  bulletTexture("bullet", 10, 4);

  // Cleanup
  g.destroy();

  

  // Go to menu
  this.scene.start("MenuScene");
}


}
