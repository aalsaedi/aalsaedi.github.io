let player, floor, diamonds, sound, shadowTexture, lightSprite, totalDiamonds = 0, cursors;

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.spritesheet('player', 'assets/player.jpg', { frameWidth: 72, frameHeight: 72 });
    this.load.image('black', 'assets/black.png');
    this.load.image('background', 'assets/bg.jpg');
    this.load.image('diamond', 'assets/diamond.png'); 
    this.load.audio('japanese', 'assets/japanese.mp3'); 
  }

  create() {
   
    const bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
    bg.setDisplaySize(this.scale.width, this.scale.height - 50);

    
    floor = this.add.rectangle(400, this.scale.height - 25, 800, 50, 0x000000).setOrigin(0.5, 0.5);
    this.physics.add.existing(floor, true);

   
    player = this.physics.add.sprite(50, this.scale.height - 75, 'player'); 
    player.setScale(0.5);
    player.setCollideWorldBounds(true);

    
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }), 
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'idle',
      frames: [{ key: 'player', frame: 0 }], 
      frameRate: 10
    });

    
    this.physics.add.collider(player, floor);

    
    cursors = this.input.keyboard.createCursorKeys();

   
    diamonds = this.physics.add.staticGroup();

    
    diamonds.create(100, this.scale.height - 50, 'diamond').setScale(0.8); 
    diamonds.create(300, this.scale.height - 50, 'diamond').setScale(0.8); 
    diamonds.create(500, this.scale.height - 50, 'diamond').setScale(0.8); 
    diamonds.create(700, this.scale.height - 50, 'diamond').setScale(0.8); 

    diamonds.create(200, this.scale.height - 150, 'diamond').setScale(0.8); 
    diamonds.create(600, this.scale.height - 200, 'diamond').setScale(0.8); 
    diamonds.create(400, this.scale.height - 210, 'diamond').setScale(0.8); 

    
    sound = this.sound.add('japanese', { loop: true }); 
    sound.play(); 

   
    this.physics.add.overlap(player, diamonds, this.collectDiamond, null, this);

   
    shadowTexture = this.textures.createCanvas('shadowTexture', this.scale.width, this.scale.height);
    lightSprite = this.add.image(0, 0, 'shadowTexture').setOrigin(0, 0);
    lightSprite.setBlendMode(Phaser.BlendModes.MULTIPLY);

    
    this.textStyle = { font: '32px Arial', fill: '#FF0000', align: 'center' };
    this.textMessage = this.add.text(this.scale.width / 2, this.scale.height / 2, '', this.textStyle).setOrigin(0.5);
  }

  update() {
    
    player.setVelocityX(0);

    if (cursors.left.isDown) {
      player.setVelocityX(-350);
      player.setScale(-0.5, 0.5); 
      player.anims.play('run', true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(350);
      player.setScale(0.5);
      player.anims.play('run', true); 
    } else {
      player.anims.play('idle', true); 
    }

    if (cursors.up.isDown && player.body.blocked.down) {
      player.setVelocityY(-350);
    }

    
    this.updateShadowTexture();
  }

  collectDiamond(player, diamond) {
    diamond.disableBody(true, true); 
    totalDiamonds++;

    
    if (totalDiamonds === 7) { 
      sound.stop(); 
      this.textMessage.setText('Mission Complete! The Ninja is Unstoppable!');
    }
  }

  updateShadowTexture() {
    const ctx = shadowTexture.getContext();
    ctx.fillStyle = 'rgb(10, 10, 10)';
    ctx.fillRect(0, 0, this.scale.width, this.scale.height);

    const radius = 100;
    const heroX = player.x;
    const heroY = player.y;

    const gradient = ctx.createRadialGradient(heroX, heroY, 30, heroX, heroY, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(heroX, heroY, radius, 0, Math.PI * 2);
    ctx.fill();

    shadowTexture.refresh();
  }
}

export default GameScene;
