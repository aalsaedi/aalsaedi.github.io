
class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene'); 
        this.playerSpeed = 160;
    }

    // ==========================================================
    // PRELOAD: 
    // ==========================================================
    preload() {
        // [Background images]
        this.load.image('newBg', 'assets/images/background.png'); 
        
        // [Tile Sprites] 
        this.load.image('ground', 'assets/images/ground_tile.png'); 
        
        // [Spritesheets] 
        this.load.spritesheet('dino', 'assets/spritesheets/DinoSprites_doux.png', {
            frameWidth: 24, 
            frameHeight: 24 
        });

        // [Objects manipulation] 
        this.load.image('coin', 'assets/images/coin.png');

        this.load.image('rock', 'assets/images/Rock.png');
        
        // [Audio output]
        this.load.audio('bgMusic', ['assets/audio/bg_music.mp3']);
        this.load.audio('collectSound', ['assets/audio/collect.mp3']);
    }

    // ==========================================================
    // CREATE:
    // ==========================================================
    create() {
        // 1. [Scene & Background images]
        let bg = this.add.image(0, 0, 'newBg').setOrigin(0, 0); 
        bg.displayWidth = 800;
        bg.displayHeight = 600; 

        // 2. [Physics]
        this.platforms = this.physics.add.staticGroup();
        
        const InvisibleGroundY = 585; 
        
        this.platforms.create(400, InvisibleGroundY, 'ground')
            .setScale(25, 1) 
            .setVisible(false) 
            .refreshBody(); 

        // 3. [Objects manipulation] و [Physics]: إنشاء اللاعب
        this.player = this.physics.add.sprite(460, 450, 'dino');
        this.player.setScale(2.0);
        this.player.setCollideWorldBounds(true); 

        // 4. [Spritesheets]
        this.createAnimations();
        this.player.play('idle');

        // 5. [Input]
        this.cursors = this.input.keyboard.createCursorKeys();

    
    this.cursors.right.on('down', () => {
        this.player.setVelocityX(this.playerSpeed);
        this.player.flipX = false;
        this.player.anims.play('run', true);
    });

    this.cursors.right.on('up', () => {
        this.player.setVelocityX(0);
        this.player.anims.play('idle', true);
    });
    
    this.cursors.left.on('down', () => {
        this.player.setVelocityX(-this.playerSpeed);
        this.player.flipX = true;
        this.player.anims.play('run', true);
    });

    this.cursors.left.on('up', () => {
        this.player.setVelocityX(0);
        this.player.anims.play('idle', true);
    });

    this.cursors.up.on('down', () => {
         if (this.player.body.touching.down) {
            this.player.setVelocityY(-400); 
        }
    });
        
        // 6. [Physics]
        this.physics.add.collider(this.player, this.platforms); 
        
        // 7. [Cameras]
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
        this.cameras.main.setBounds(0, 0, 800, 600); 
        
        // 8. [Score & Health System Setup]
        this.score = 0;
        this.playerHealth = 3; 
        this.scoreText = this.add.text(16, 16, 'score: 0', { 
        fontSize: '32px', 
        fill: '#ffffff', // لون خط ابيض
        stroke: '#000000', // حد أسود حول الخط
        strokeThickness: 4,
        padding: { x: 10, y: 5 } 
    }).setScrollFactor(0); 

    this.healthText = this.add.text(16, 50, 'Health: 3', { 
        fontSize: '32px', 
        fill: '#ff0000', // لون أحمر للصحة
        stroke: '#000000', 
        strokeThickness: 4,
        padding: { x: 10, y: 5 } 
    }).setScrollFactor(0);

        // 9. [Audio output]
        this.music = this.sound.add('bgMusic', { volume: 0.5, loop: true });
        this.music.play();
        
        // 10. [Objects manipulation] و [Physics]
        this.createCoins();
        
        // 11. [Physics]
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

        // 12. [Falling Traps]
        this.traps = this.physics.add.group();

        // 13. [Physics]
        this.physics.add.collider(this.traps, this.platforms, this.handleTrapGroundCollision, null, this);

        // 14. [Physics]
        this.physics.add.overlap(this.player, this.traps, this.hitObstacle, null, this);

        // 15. [Timers]
        this.time.addEvent({
        delay: 2000, 
        callback: this.spawnTrap,
        callbackScope: this,
        loop: true
    });
    }

    // UPDATE:
    update() {
        
    }
    
    createAnimations() {
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('dino', { start: 0, end: 3 }),
            frameRate: 8, 
            repeat: -1 
        });

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('dino', { start: 4, end: 9 }),
            frameRate: 12, 
            repeat: -1
        });
    }
    
    
    createCoins() {
        this.coins = this.physics.add.group({
            key: 'coin',
            repeat: 5, 
            setXY: { x: 150, y: 0, stepX: 100 } 
        });

        this.coins.children.iterate(function (child) {
            child.setScale(0.3);
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(this.coins, this.platforms);
    }
    
    collectCoin(player, coin) {
    this.score += 10;
    this.scoreText.setText('score: ' + this.score);
    
    this.sound.play('collectSound'); 
    
    coin.disableBody(true, true); 

    this.time.delayedCall(1000, () => { 
        const randomX = Phaser.Math.Between(50, 750); 
        const spawnY = 0; 

        coin.enableBody(true, randomX, spawnY, true, true);
        
        coin.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        coin.setScale(0.3); 
        
    }, [], this); 
    }
    

hitObstacle(player, trap) {
    trap.disableBody(true, true); 
    
    this.playerHealth -= 1;
    this.healthText.setText('Health: ' + this.playerHealth);
    
    player.setTint(0xff0000); 
    this.time.delayedCall(200, () => {
        player.setTint(0xffffff); 
    }, [], this);
    
    if (this.playerHealth <= 0) {
        this.gameOver();
    }
}

gameOver() {
    this.physics.pause();
    
    this.player.anims.play('idle'); 
    
    if (this.music && this.music.isPlaying) {
        this.music.stop();
    }
    
    this.add.text(400, 300, 'GAME OVER', { 
        fontSize: '64px', 
        fill: '#ff0000',
        stroke: '#000000',
        strokeThickness: 8
    }).setOrigin(0.5).setDepth(10); 

    
    const restartText = this.add.text(400, 380, 'press to restart', {
        fontSize: '32px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
    }).setOrigin(0.5).setDepth(10);
    
    
    this.input.once('pointerdown', () => {
        this.restartGame();
    }, this);
}
    
    spawnTrap() {
    
    const randomX = Phaser.Math.Between(50, 750);
    const spawnY = -50; 

    
    let trap = this.traps.get(randomX, spawnY, 'rock');
    
    if (trap) {
        trap.setScale(0.7); 
        trap.enableBody(true, randomX, spawnY, true, true);
        trap.setCollideWorldBounds(false); 
        trap.body.setGravityY(100); 
        trap.setDepth(1); 
    }
}

    handleTrapGroundCollision(trap, platform) {
        trap.body.setVelocityX(0);
        trap.body.setAccelerationX(0);
        
        this.time.delayedCall(1000, () => {
            trap.disableBody(true, true);
        }, [], this);
    }


    restartGame() {
    this.physics.resume(); 
    
    this.scene.restart(); 
}

}

