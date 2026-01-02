var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: { default: 'arcade', arcade: { gravity: { y: 300 }, debug: false } },
    scene: { preload: preload, create: create, update: update }
};

var player, platforms, cursors, stars, score = 0, scoreText;

var game = new Phaser.Game(config);

function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.audio('jump', 'assets/jump.wav');
}

function create() {
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms);

    stars = this.physics.add.group({ key: 'star', repeat: 11, setXY: { x: 12, y: 0, stepX: 70 } });
    stars.children.iterate(function (child) { child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)); });

    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);

    cursors = this.input.keyboard.createCursorKeys();
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
}

function update() {
    if (cursors.left.isDown) { player.setVelocityX(-160); }
    else if (cursors.right.isDown) { player.setVelocityX(160); }
    else { player.setVelocityX(0); }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
        this.sound.play('jump');
    }
}

function collectStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
}