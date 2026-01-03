class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        this.bgMusic = this.sound.add('bg-music', { volume: 0.02, loop: true });
        this.bgMusic.play();

        this.physics.world.setBounds(0, 0, 1600, 600);

        const width = this.scale.width;
        const height = this.scale.height;
        
        this.bg = this.add.tileSprite(0, 0, width, height, 'bg').setOrigin(0, 0).setScrollFactor(0);

        this.platforms = this.physics.add.staticGroup();

        const createPlatform = (x, y, w) => {
            const p = this.add.tileSprite(x, y, w, 32, 'ground-img');
            
            this.physics.add.existing(p, true);
            
            this.platforms.add(p);
            
            return p;
        };

        createPlatform(400, 584, 800);
        createPlatform(1200, 584, 800);

        createPlatform(600, 400, 200);
        createPlatform(50, 250, 200);
        createPlatform(750, 220, 200);
        
        createPlatform(1000, 450, 200);
        createPlatform(1250, 300, 200);
        createPlatform(1500, 400, 200);

        this.player = this.physics.add.sprite(100, 450, 'player');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.coins = this.physics.add.group({
            key: 'coin',
            repeat: 22,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.coins.children.iterate((child) => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            child.play('spin');
        });

        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Score: 0', { 
            fontSize: '32px', 
            fill: '#000',
            fontFamily: 'Arial'
        });
        this.scoreText.setScrollFactor(0);

        this.spikes = this.physics.add.staticGroup();
        
        this.spikes.create(500, 556, 'spike');
        this.spikes.create(900, 556, 'spike');
        this.spikes.create(1400, 556, 'spike');
        
        this.spikes.create(600, 384, 'spike');
        this.spikes.create(1250, 284, 'spike');

        this.spikes.children.iterate((child) => {
            child.setScale(0.5);
            child.refreshBody();
        });

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.coins, this.platforms);
        this.physics.add.collider(this.player, this.spikes, this.hitSpike, null, this);

        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

        this.cameras.main.setBounds(0, 0, 1600, 600);
        this.cameras.main.startFollow(this.player);
    }

    update() {
        this.bg.tilePositionX = this.cameras.main.scrollX * 0.5;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-300);
            this.player.setTexture('player-run');
            this.player.setFlipX(true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(300);
            this.player.setTexture('player-run');
            this.player.setFlipX(false);
        } else {
            this.player.setVelocityX(0);
            this.player.setTexture('player');
        }

        if ((this.cursors.up.isDown || this.spaceKey.isDown) && this.player.body.touching.down) {
            this.player.setVelocityY(-550);
        }

        if (!this.player.body.touching.down) {
            this.player.setTexture('player-jump');
        }
    }

    collectCoin(player, coin) {
        coin.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        this.playCoinSound();

        if (this.coins.countActive(true) === 0) {
            this.bgMusic.stop();
            this.scene.start('GameOverScene', { score: this.score, win: true });
        }
    }

    hitSpike(player, spike) {
        this.physics.pause();
        player.setTint(0xff0000);
        this.bgMusic.stop();
        this.scene.start('GameOverScene', { score: this.score, win: false });
    }

    playCoinSound() {
        this.sound.play('coin-sfx');
    }
}