class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene");
    }

    preload() {
        this.load.image('mid_fish', 'assets/images/mid_layer_fish.png');
        this.load.image('fore_fish', 'assets/images/fore_layer_detail.png');
        this.load.image('treasure', 'assets/images/treasure_chest.png');
        this.load.image('oxy_tank', 'assets/images/oxygen_tank.png');
        this.load.image('jelly', 'assets/images/jellyfish.png');
        this.load.image('shield_pickup_img', 'assets/images/shield_pickup.png'); 
        this.load.spritesheet('shield_sheet', 'assets/sprites/shield_anim.png', { frameWidth: 64, frameHeight: 64 });
        this.load.audio('gold_snd', 'assets/audio/collect_gold.mp3');
        this.load.audio('oxy_snd', 'assets/audio/collect_oxygen.mp3');
        this.load.audio('hit_snd', 'assets/audio/hit.mp3');
        this.load.audio('shield_snd', 'assets/audio/shield_up.mp3'); 
        this.load.spritesheet('diver-side', 'assets/images/diver-side.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('diver-front', 'assets/images/diver-front.png', { frameWidth: 64, frameHeight: 64 });
    }

    create(data) {
        const { width, height } = this.scale;
        const worldWidth = 5000;
        const worldDepth = 100000;

        //  LOAD PERMANENT UPGRADES 
        const upgrades = JSON.parse(localStorage.getItem('diver_upgrades')) || {
            maxOxygen: 100,
            speedMultiplier: 1.0,
            startShield: false
        };

        this.maxOxygen = upgrades.maxOxygen;
        this.playerSpeedBase = 350 * upgrades.speedMultiplier;

        //  INITIALIZE RUN DATA
        this.isPaused = false;
        this.isGameOver = false;
        this.score = 0;
        this.maxDepthReached = 0;
        this.oxygen = this.maxOxygen;
        let startY = 300;

        
        if (data && data.isContinuing) {
            const savedGame = JSON.parse(localStorage.getItem('diver_save_data'));
            if (savedGame) {
                this.score = savedGame.score || 0;
                this.oxygen = savedGame.oxygen || this.maxOxygen;
                this.maxDepthReached = savedGame.maxDepth || 0;
                startY = savedGame.y || 300;
            }
        }

        //  PHYSICS & WORLD 
        this.physics.world.setBounds(0, 0, worldWidth, worldDepth);
        this.add.graphics().setScrollFactor(0).setDepth(-1).fillStyle(0x004080, 1).fillRect(0, 0, width, height);
        this.mid_layer = this.add.tileSprite(width / 2, height / 2, width, height, 'mid_fish').setScrollFactor(0).setDepth(1);
        this.fore_layer = this.add.tileSprite(width / 2, height / 2, width, height, 'fore_fish').setScrollFactor(0).setDepth(2);

        this.createParticles(worldWidth, worldDepth);

        // PLAYER 
        this.player = this.physics.add.sprite(worldWidth / 2, startY, 'diver-front', 0);
        this.player.setCollideWorldBounds(true).setDrag(1200).setDepth(10);
        this.boostParticles.startFollow(this.player);

        const isNewRun = !(data && data.isContinuing);
        this.hasShield = (upgrades.startShield && isNewRun);
        this.shieldVisual = this.add.sprite(this.player.x, this.player.y, 'shield_sheet').setDepth(11).setVisible(this.hasShield).setScale(1.3).setAlpha(0.7);
        if (this.hasShield) this.shieldVisual.play('shield_glow');

        this.createAnimations();
        this.setupGroups();

        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
        this.cameras.main.setBounds(0, 0, worldWidth, worldDepth);

        this.setupUI(width, height);
        this.setupInputs();
        this.setupMenus(width, height);
        
        // Auto-save progress
        this.saveEvent = this.time.addEvent({ delay: 5000, callback: this.saveGameData, callbackScope: this, loop: true });
    }

    createParticles(w, d) {
        this.bubbleParticles = this.add.particles(0, 0, 'bubble', {
            x: { min: 0, max: w }, y: { min: 500, max: d },
            scale: { start: 0.2, end: 1.5 }, alpha: { start: 0.4, end: 0.1 },
            speedY: { min: -50, max: -150 }, frequency: 200, lifespan: 10000
        }).setDepth(0);

        this.boostParticles = this.add.particles(0, 0, 'bubble', {
            scale: { start: 0.4, end: 0 }, alpha: { start: 0.6, end: 0 },
            speed: { min: 20, max: 100 }, lifespan: 500, blendMode: 'ADD', emitting: false
        }).setDepth(9);
    }

    createAnimations() {
        if (!this.anims.exists('shield_glow')) {
            this.anims.create({ key: 'shield_glow', frames: this.anims.generateFrameNumbers('shield_sheet', { start: 0, end: 32 }), frameRate: 20, repeat: -1 });
        }
        if (!this.anims.exists('swim_side')) {
            this.anims.create({ key: 'swim_side', frames: this.anims.generateFrameNumbers('diver-side', { start: 0, end: 11 }), frameRate: 12, repeat: -1 });
        }
    }

    setupGroups() {
        this.treasures = this.physics.add.group();
        this.oxyTanks = this.physics.add.group();
        this.jellies = this.physics.add.group();
        this.shields = this.physics.add.group();

        this.physics.add.overlap(this.player, this.treasures, this.collectTreasure, null, this);
        this.physics.add.overlap(this.player, this.oxyTanks, this.collectOxygen, null, this);
        this.physics.add.overlap(this.player, this.jellies, this.hitHazard, null, this);
        this.physics.add.overlap(this.player, this.shields, this.collectShield, null, this);

        this.nextTreasureDepth = this.maxDepthReached + 50; 
        this.nextTankDepth = this.maxDepthReached + 300;
        this.nextJellyDepth = this.maxDepthReached + 100;
        this.nextShieldDepth = this.maxDepthReached + 200;
    }

    setupUI(width, height) {
        this.oxyBox = this.add.graphics().setScrollFactor(0).setDepth(100);
        this.oxyBar = this.add.graphics().setScrollFactor(0).setDepth(101);
        this.depthText = this.add.text(50, 40, "DEPTH: 0m", { fontSize: '32px', fill: '#ffffff' }).setScrollFactor(0).setDepth(100);
        this.scoreText = this.add.text(width - 50, 40, "SCORE: 0", { fontSize: '32px', fill: '#ffd700' }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);
        this.warningText = this.add.text(width / 2, height / 2, "LOW OXYGEN!", { fontSize: '64px', fill: '#ff0000' }).setOrigin(0.5).setScrollFactor(0).setDepth(200).setVisible(false);
        this.warningTween = this.tweens.add({ targets: this.warningText, alpha: 0, duration: 250, yoyo: true, repeat: -1, paused: true });
        this.shieldIcon = this.add.image(width - 50, 130, 'shield_pickup_img').setOrigin(1, 0).setScrollFactor(0).setDepth(100).setScale(0.5).setVisible(this.hasShield);
    }

    setupInputs() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: 'W', down: 'S', left: 'A', right: 'D', shift: 'SHIFT', esc: 'ESC', space: 'SPACE', enter: 'ENTER'
        });
        this.input.mouse.disableContextMenu();
    }

    setupMenus(width, height) {
        this.menuBg = this.add.rectangle(0, 0, width, height, 0x000000, 0.8).setOrigin(0).setScrollFactor(0).setDepth(5000).setVisible(false).setInteractive();
        this.pauseText = this.add.text(width / 2, height * 0.3, 'PAUSED', { fontSize: '80px', fill: '#00ffff' }).setOrigin(0.5).setScrollFactor(0).setDepth(5001).setVisible(false);
        this.gameOverText = this.add.text(width / 2, height * 0.3, 'OUT OF OXYGEN', { fontSize: '64px', fill: '#ff0000' }).setOrigin(0.5).setScrollFactor(0).setDepth(5001).setVisible(false);

        this.btnPrimary = this.add.text(width / 2, height * 0.5, 'RESUME', { fontSize: '40px', backgroundColor: '#222', padding: 15 }).setOrigin(0.5).setScrollFactor(0).setDepth(5001).setVisible(false).setInteractive({ useHandCursor: true });
        this.btnSecondary = this.add.text(width / 2, height * 0.65, 'MAIN MENU', { fontSize: '32px', backgroundColor: '#444', padding: 10 }).setOrigin(0.5).setScrollFactor(0).setDepth(5001).setVisible(false).setInteractive({ useHandCursor: true });

        this.btnPrimary.on('pointerdown', () => {
            if (this.isGameOver) this.scene.restart();
            else this.togglePause();
        });

        this.btnSecondary.on('pointerdown', () => {
            if (!this.isGameOver) this.saveGameData();
            this.scene.start("MenuScene");
        });
    }

    togglePause() {
        if (this.isGameOver) return;
        this.isPaused = !this.isPaused;
        this.menuBg.setVisible(this.isPaused);
        this.pauseText.setVisible(this.isPaused);
        this.btnPrimary.setVisible(this.isPaused).setText('RESUME');
        this.btnSecondary.setVisible(this.isPaused);
        if (this.isPaused) this.physics.pause();
        else this.physics.resume();
    }

    saveGameData() {
        if (this.isGameOver || !this.player) return;
        const data = { 
            score: this.score, 
            oxygen: this.oxygen, 
            y: this.player.y, 
            maxDepth: this.maxDepthReached 
        };
        localStorage.setItem('diver_save_data', JSON.stringify(data));
        console.log("Game Saved");
    }

    triggerGameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;
        this.physics.pause();
        if (this.saveEvent) this.saveEvent.remove(); // Stop the auto-save loop immediately

        // Clear the run data so they can't "Continue" a dead run
        localStorage.removeItem('diver_save_data');

        
        this.menuBg.setVisible(true);
        this.gameOverText.setVisible(true).setText("FINAL SCORE: " + Math.floor(this.score));
        this.btnPrimary.setVisible(true).setText('RETRY');
        this.btnSecondary.setVisible(true);
    }

    update() {
        const pad = this.input.gamepad ? this.input.gamepad.getPad(0) : null;
        if (Phaser.Input.Keyboard.JustDown(this.wasd.esc) || (pad && pad.buttons[9].pressed)) this.togglePause();

        if (this.isPaused || this.isGameOver) {
            if (Phaser.Input.Keyboard.JustDown(this.wasd.space) || Phaser.Input.Keyboard.JustDown(this.wasd.enter) || (pad && pad.buttons[0].pressed)) {
                if (this.isGameOver) this.scene.restart();
                else this.togglePause();
            }
            return; 
        }

        if (!this.player || !this.player.active) return;

        this.shieldVisual.setPosition(this.player.x, this.player.y);
        this.mid_layer.tilePositionX = this.cameras.main.scrollX * 0.6;
        this.mid_layer.tilePositionY = this.cameras.main.scrollY * 0.6;
        this.fore_layer.tilePositionX = this.cameras.main.scrollX;
        this.fore_layer.tilePositionY = this.cameras.main.scrollY;

        this.handleMovement(pad);
        this.handleOxygen();
        this.handleSpawning();
    }

    handleMovement(pad) {
        let isBoosting = this.wasd.shift.isDown || this.input.activePointer.rightButtonDown() || (pad && pad.buttons[6].value > 0.1);
        const currentSpeed = isBoosting ? this.playerSpeedBase * 2 : this.playerSpeedBase;
        let vX = 0, vY = 0;
        if (this.cursors.left.isDown || this.wasd.left.isDown || (pad && pad.leftStick.x < -0.2)) vX = -currentSpeed;
        else if (this.cursors.right.isDown || this.wasd.right.isDown || (pad && pad.leftStick.x > 0.2)) vX = currentSpeed;
        if (this.cursors.up.isDown || this.wasd.up.isDown || (pad && pad.leftStick.y < -0.2)) vY = -currentSpeed;
        else if (this.cursors.down.isDown || this.wasd.down.isDown || (pad && pad.leftStick.y > 0.2)) vY = currentSpeed;

        if (vX !== 0 || vY !== 0) {
            this.player.setVelocity(vX, vY);
            this.player.setTexture(vX !== 0 ? 'diver-side' : 'diver-front').setFlipX(vX > 0);
            if (vX !== 0) this.player.anims.play('swim_side', true);
            const angle = Math.atan2(vY, vX);
            this.player.setRotation(Math.abs(vX) > 50 ? (vX > 0 ? angle : angle + Math.PI) : 0);
            this.boostParticles.emitting = isBoosting;
            if (isBoosting) this.boostParticles.setAngle({ min: Phaser.Math.RadToDeg(angle) + 160, max: Phaser.Math.RadToDeg(angle) + 200 });
        } else {
            this.player.setVelocityY(Math.sin(this.time.now / 200) * 20);
            this.player.setTexture('diver-front', 0).setRotation(0);
            this.boostParticles.emitting = false;
        }
    }

    handleOxygen() {
        let drain = (this.player.y > 400) ? 0.06 : -0.3;
        if (this.wasd.shift.isDown) drain += 0.15;
        this.oxygen = Phaser.Math.Clamp(this.oxygen - drain, 0, this.maxOxygen);
        this.drawOxygenBar();
        if (this.oxygen < 25 && !this.warningText.visible) { this.warningText.setVisible(true); this.warningTween.resume(); }
        else if (this.oxygen >= 25 && this.warningText.visible) { this.warningText.setVisible(false); this.warningTween.pause(); }
        if (this.oxygen <= 0) this.triggerGameOver();
    }

    handleSpawning() {
        let currentDepth = Math.max(0, Math.floor((this.player.y - 300) / 10));
        if (currentDepth > this.maxDepthReached) {
            this.score += (currentDepth - this.maxDepthReached) * 10;
            this.maxDepthReached = currentDepth;
            this.scoreText.setText("SCORE: " + Math.floor(this.score));
        }
        this.depthText.setText("DEPTH: " + currentDepth + "m");
        if (currentDepth >= this.nextTreasureDepth) { this.spawnItem(this.treasures, 'treasure'); this.nextTreasureDepth += Phaser.Math.Between(150, 400); }
        if (currentDepth >= this.nextTankDepth) { this.spawnItem(this.oxyTanks, 'oxy_tank'); this.nextTankDepth += Phaser.Math.Between(400, 800); }
        if (currentDepth >= this.nextJellyDepth) { this.spawnItem(this.jellies, 'jelly'); this.nextJellyDepth += Phaser.Math.Between(100, 300); }
        if (currentDepth >= this.nextShieldDepth) { this.spawnItem(this.shields, 'shield_pickup_img'); this.nextShieldDepth += Phaser.Math.Between(400, 900); }
    }

    spawnItem(group, key) {
        const item = group.create(Phaser.Math.Between(500, 4500), this.player.y + 800, key).setDepth(5);
        if (key === 'treasure') item.setScale(0.5);
        else if (key === 'oxy_tank') { item.setScale(0.4); this.tweens.add({ targets: item, y: item.y - 20, duration: 1000, yoyo: true, repeat: -1 }); }
        else if (key === 'jelly') { item.setScale(0.3); item.body.setSize(item.width * 0.6, item.height * 0.6); this.tweens.add({ targets: item, x: item.x + 200, duration: 2000, yoyo: true, repeat: -1 }); }
        else if (key === 'shield_pickup_img') { item.setScale(0.5); this.tweens.add({ targets: item, scale: 0.6, duration: 600, yoyo: true, repeat: -1 }); }
    }

    collectTreasure(p, t) { 
        t.destroy(); 
        this.sound.play('gold_snd'); 
        this.score += 5000;
        let currentTotal = parseInt(localStorage.getItem('total_gold')) || 0;
        localStorage.setItem('total_gold', currentTotal + 5000); 
    }
    
    collectOxygen(p, o) { o.destroy(); this.sound.play('oxy_snd'); this.oxygen = Math.min(this.oxygen + 40, this.maxOxygen); }
    collectShield(p, s) { s.destroy(); this.sound.play('shield_snd'); this.hasShield = true; this.shieldVisual.setVisible(true).play('shield_glow'); this.shieldIcon.setVisible(true); }

    hitHazard(p, h) {
        h.destroy();
        if (this.hasShield) { this.hasShield = false; this.shieldVisual.setVisible(false); this.shieldIcon.setVisible(false); return; }
        this.sound.play('hit_snd'); this.oxygen -= 25; this.cameras.main.shake(200, 0.01);
        this.player.setTint(0xff0000); this.time.delayedCall(200, () => this.player.clearTint());
    }

    drawOxygenBar() {
        this.oxyBar.clear(); this.oxyBox.clear();
        this.oxyBox.fillStyle(0x000000, 0.5).fillRect(50, 85, 300, 25);
        this.oxyBar.fillStyle(this.oxygen < 30 ? 0xff0000 : 0x00ffff, 1).fillRect(53, 88, (294 * (this.oxygen / this.maxOxygen)), 19);
    }
}

export default PlayScene;