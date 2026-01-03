const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update,
});

let score = 0;
let scoreText;
let platforms;
let diamonds;
let cursors;
let player;
let backgroundMusic;

function preload() {
  // Load assets
  game.load.image('sky', './assets/sky.png');
  game.load.image('ground', './assets/platform.png');
  game.load.image('diamond', './assets/diamond.png');
  game.load.spritesheet('woof', './assets/woof.png', 32, 32);

  // Load background music (with MP3 and OGG for browser compatibility)
  game.load.audio('backgroundSound', ['./assets/bgMusic.mp3', './assets/bgMusic.ogg']);
}

function create() {
  // Start physics
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // Add the sky background
  game.add.sprite(0, 0, 'sky');

  // Create platforms
  createPlatforms();

  // Create diamonds (collectibles)
  createDiamonds();

  // Add the player
  player = game.add.sprite(32, game.world.height - 150, 'woof');
  game.physics.arcade.enable(player);
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 800;
  player.body.collideWorldBounds = true;

  // Player animations
  player.animations.add('left', [0, 1], 10, true);
  player.animations.add('right', [2, 3], 10, true);

  // Score text
  scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

  // Cursor keys for input
  cursors = game.input.keyboard.createCursorKeys();

  // Add and prepare background music
  backgroundMusic = game.add.audio('backgroundSound');
  backgroundMusic.loop = true; // Ensure it loops
  backgroundMusic.onDecoded.add(() => {
    console.log('Background music decoded and ready!');
  });

  // Wait for user interaction to start music (handles autoplay restrictions)
  game.input.onDown.addOnce(() => {
    backgroundMusic.play();
  });
}

function update() {
  // Player velocity reset
  player.body.velocity.x = 0;

  // Collisions
  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(diamonds, platforms);

  // Overlap check for collecting diamonds
  game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this);

  // Player movement
  if (cursors.left.isDown) {
    player.body.velocity.x = -150;
    player.animations.play('left');
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 150;
    player.animations.play('right');
  } else {
    player.animations.stop();
  }

  // Jumping
  if (cursors.up.isDown && player.body.touching.down) {
    player.body.velocity.y = -400;
  }

  // Win condition
  if (score === 120) {
    showWinScreen();
    backgroundMusic.stop();
  }
}

// Helper function: Create platforms
function createPlatforms() {
  platforms = game.add.group();
  platforms.enableBody = true;

  const ground = platforms.create(0, game.world.height - 64, 'ground');
  ground.scale.setTo(2, 2);
  ground.body.immovable = true;

  const ledge1 = platforms.create(400, 450, 'ground');
  ledge1.body.immovable = true;

  const ledge2 = platforms.create(-75, 350, 'ground');
  ledge2.body.immovable = true;
}

// Helper function: Create diamonds
function createDiamonds() {
  diamonds = game.add.group();
  diamonds.enableBody = true;

  for (var i = 0; i < 12; i++) {
    const diamond = diamonds.create(i * 70, 0, 'diamond');
    diamond.body.gravity.y = 1000;
    diamond.body.bounce.y = 0.3 + Math.random() * 0.2;
  }
}

// Collect diamond and update score
function collectDiamond(player, diamond) {
  diamond.kill();
  score += 10;
  scoreText.text = 'Score: ' + score;
}

// Show the "You Win" screen
function showWinScreen() {
  game.add.text(game.world.centerX - 100, game.world.centerY, 'You Win!', {
    fontSize: '64px',
    fill: '#fff',
  });
  game.paused = true; // Pause the game
}
