/**
 * Project: Legends of CIT - Final Optimized Version
 * Developer: Abdulaziz Al-Thamali
 * Framework: Phaser 3
 */

// ==========================================
// Global Configuration
// ==========================================
const CONFIG = {
    frameWidth: 64, frameHeight: 64, playerSpeed: 400, npcSpeed: 50,
    itemSpawnDelay: 3000, coffeeSpawnInterval: 10000,
    collectTimeLimit: 10000, warningTime: 3, maxLives: 3,
    colors: { primary: 0x627254, secondary: 0x76885B, light: 0xDDDDDD, lighter: 0xEEEEEE }
};

// ==========================================
// Utility Functions
// ==========================================
const Utils = {
    createLPCAnims(scene, key) {
        [
            { key: 'up', start: 105, end: 112 },
            { key: 'left', start: 118, end: 125 },
            { key: 'down', start: 131, end: 138 },
            { key: 'right', start: 144, end: 151 }
        ].forEach(dir => {
            if (!scene.anims.exists(`${key}_walk_${dir.key}`)) {
                scene.anims.create({
                    key: `${key}_walk_${dir.key}`,
                    frames: scene.anims.generateFrameNumbers(key, { start: dir.start, end: dir.end }),
                    frameRate: 10, repeat: -1
                });
            }
        });
    }
};

// ==========================================
// Menu Scene
// ==========================================
class MenuScene extends Phaser.Scene {
    constructor() { super({ key: 'MenuScene' }); }

    preload() {
        this.load.image('logo', 'assets/Logo_LCIT.png');
    }

    create() {
        const { width, height } = this.cameras.main;
        const bg = this.add.graphics();
        bg.fillGradientStyle(CONFIG.colors.primary, CONFIG.colors.primary, CONFIG.colors.secondary, CONFIG.colors.secondary, 1);
        bg.fillRect(0, 0, width, height);

        // Logo
        const logo = this.add.image(width / 2, height / 2 - 320, 'logo');
        logo.setScale(0.2);

        this.add.text(width / 2, height / 2 - 50, 'LEGENDS OF CIT', {
            fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '120px', fontStyle: 'bold',
            color: '#EEEEEE', stroke: '#627254', strokeThickness: 8,
            shadow: { offsetX: 0, offsetY: 0, color: '#76885B', blur: 30, fill: true }
        }).setOrigin(0.5);

        const startBtn = this.add.rectangle(width / 2, height / 2 + 150, 300, 80, CONFIG.colors.lighter)
            .setInteractive({ useHandCursor: true });
        this.add.text(width / 2, height / 2 + 150, 'START GAME', {
            fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '40px',
            fontStyle: 'bold', color: '#627254'
        }).setOrigin(0.5);

        startBtn.on('pointerdown', () => {
            this.cameras.main.fadeOut(1000);
            this.time.delayedCall(1000, () => this.scene.start('OutsideScene', { spawnPoint: 'player_spawn' }));
        });
    }
}

// ==========================================
// Transition Scene
// ==========================================
class TransitionScene extends Phaser.Scene {
    constructor() { super({ key: 'TransitionScene' }); }
    init(data) { this.nextScene = data.targetScene; this.spawnPoint = data.spawnPoint; }
    create() {
        this.add.rectangle(0, 0, 1920, 1280, 0x000000).setOrigin(0);
        this.add.text(960, 640, 'Loading...', { 
            fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '40px', color: '#EEEEEE' 
        }).setOrigin(0.5);
        this.time.delayedCall(800, () => this.scene.start(this.nextScene, { spawnPoint: this.spawnPoint }));
    }
}

// ==========================================
// Game Over Scene
// ==========================================
class GameOverScene extends Phaser.Scene {
    constructor() { super({ key: 'GameOverScene' }); }

    create() {
        const { width, height } = this.cameras.main;
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x8B0000, 0x8B0000, 0xFF0000, 0xFF0000, 1);
        bg.fillRect(0, 0, width, height);

        this.add.text(width / 2, height / 2 - 100, 'GAME OVER', {
            fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '120px', fontStyle: 'bold',
            color: '#ffffff', stroke: '#000000', strokeThickness: 8
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 + 50, 'No more lives! Better luck next time!', {
            fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '36px', color: '#ffffff'
        }).setOrigin(0.5);

        const retryBtn = this.add.rectangle(width / 2, height / 2 + 200, 300, 80, CONFIG.colors.lighter)
            .setInteractive({ useHandCursor: true });
        this.add.text(width / 2, height / 2 + 200, 'MAIN MENU', {
            fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '40px', fontStyle: 'bold', color: '#627254'
        }).setOrigin(0.5);

        retryBtn.on('pointerdown', () => {
            this.cameras.main.fadeOut(500);
            this.time.delayedCall(500, () => this.scene.start('MenuScene'));
        });
    }
}

// ==========================================
// Base Game Scene
// ==========================================
class BaseGameScene extends Phaser.Scene {
    constructor(key) { super({ key }); }

    setupPlayer(x, y, texture) {
        this.player = this.physics.add.sprite(x, y, texture);
        this.player.setScale(1.4).setDepth(100).setCollideWorldBounds(true);
        this.player.body.setSize(30, 35).setOffset(17, 25);
        Utils.createLPCAnims(this, texture);
        return this.player;
    }

    setupCollision(sprite, layer) {
        if (layer) {
            layer.setCollisionByExclusion([-1]);
            this.physics.add.collider(sprite, layer);
        }
    }

    createVirtualControls() {
        const size = 80, x = 150, y = 1100;
        this.vKeys = { up: false, down: false, left: false, right: false };

        const createBtn = (bx, by, dir, symbol) => {
            const btn = this.add.circle(bx, by, 40, CONFIG.colors.secondary, 0.7)
                .setScrollFactor(0).setInteractive().setDepth(1000);
            this.add.text(bx, by, symbol, { 
                fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '30px', color: '#EEEEEE'
            }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);
            
            ['pointerdown', 'pointerup', 'pointerout'].forEach((event, i) => 
                btn.on(event, () => this.vKeys[dir] = i === 0)
            );
        };

        createBtn(x, y - size, 'up', '▲');
        createBtn(x, y + size, 'down', '▼');
        createBtn(x - size, y, 'left', '◀');
        createBtn(x + size, y, 'right', '▶');
    }

    updatePlayerMovement() {
        if (!this.player) return;
        this.player.setVelocity(0);
        const speed = CONFIG.playerSpeed;
        const key = this.player.texture.key;

        const moves = [
            { check: this.cursors.left.isDown || this.vKeys.left, vel: [-speed, 0], anim: 'left' },
            { check: this.cursors.right.isDown || this.vKeys.right, vel: [speed, 0], anim: 'right' },
            { check: this.cursors.up.isDown || this.vKeys.up, vel: [0, -speed], anim: 'up' },
            { check: this.cursors.down.isDown || this.vKeys.down, vel: [0, speed], anim: 'down' }
        ];

        const activeMove = moves.find(m => m.check);
        if (activeMove) {
            this.player.setVelocity(...activeMove.vel);
            this.player.anims.play(`${key}_walk_${activeMove.anim}`, true);
        } else {
            this.player.anims.stop();
        }
    }
}

// ==========================================
// Outside Scene
// ==========================================
class OutsideScene extends BaseGameScene {
    constructor() { super('OutsideScene'); }
    init(data) { this.spawnName = data.spawnPoint || 'player_spawn'; }

    preload() {
        this.load.tilemapTiledJSON('outside_map', 'assets/Outside.json');
        ['CIT', 'CIT1', 'classes', 'classroom', 'coffe', 'office', 'Park', 'preview_signs', 'stairs_preview', 'CIT2', 'CIT11']
            .forEach((t, i) => this.load.image(`tiles_${i}`, `assets/${t}.png`));
        this.load.spritesheet('player', 'assets/student1.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('npc_student', 'assets/students.png', { frameWidth: 64, frameHeight: 64 });
    }

    create() {
        const map = this.make.tilemap({ key: 'outside_map' });
        const sets = ['CIT', 'CCIT', 'Class', 'classroom', 'coffe', 'Office', 'park', 'Road', 'staircase', 'CIT2', 'CIT11']
            .map((n, i) => map.addTilesetImage(n, `tiles_${i}`));

        ['Ground', 'Details', 'Buildings'].forEach(l => map.createLayer(l, sets));
        const collisionLayer = map.createLayer('Collision', sets).setVisible(false);

        const spawn = map.findObject('Objects', obj => obj.name === this.spawnName);
        this.setupPlayer(spawn ? spawn.x : 500, spawn ? spawn.y : 500, 'player');
        this.setupCollision(this.player, collisionLayer);

        this.npcs = this.physics.add.group();
        Utils.createLPCAnims(this, 'npc_student');

        const doorMap = { 'door_right': 'player_inside_right', 'door_center': 'player_inside_center', 'door_left': 'player_inside_left' };

        map.getObjectLayer('Objects').objects.forEach(obj => {
            if (obj.name === 'npc_student') {
                const npc = this.physics.add.sprite(obj.x, obj.y, 'npc_student');
                npc.setScale(1.2).setDepth(99);
                npc.body.setSize(30, 30).setOffset(17, 25);
                npc.setCollideWorldBounds(true);
                this.setupCollision(npc, collisionLayer);
                this.npcs.add(npc);
                this.startNPCAI(npc);
            }

            if (doorMap[obj.name]) {
                const zone = this.add.zone(obj.x + obj.width / 2, obj.y + obj.height / 2, obj.width, obj.height);
                this.physics.world.enable(zone);
                this.physics.add.overlap(this.player, zone, () => {
                    if (this.cursors.up.isDown || this.vKeys.up) {
                        this.scene.start('TransitionScene', { targetScene: 'InsideScene', spawnPoint: doorMap[obj.name] });
                    }
                });
            }
        });

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.createVirtualControls();
    }

    startNPCAI(npc) {
        
        const moveLogic = () => {
            if (!npc.active) return;
            const dir = Phaser.Math.Between(0, 4);
            const speed = CONFIG.npcSpeed;
            npc.setVelocity(0);

            const moves = [
                { v: [0, -speed], anim: 'up' }, { v: [0, speed], anim: 'down' },
                { v: [-speed, 0], anim: 'left' }, { v: [speed, 0], anim: 'right' }
            ];

            if (dir < 4) {
                npc.setVelocity(...moves[dir].v);
                npc.anims.play(`npc_student_walk_${moves[dir].anim}`, true);
            } else {
                npc.anims.stop();
            }
        };

        
        moveLogic();

        
        this.time.addEvent({
            delay: Phaser.Math.Between(2000, 3000),
            callback: moveLogic, 
            loop: true
        });
    }

    update() { this.updatePlayerMovement(); }
}

// ==========================================
// Inside Scene - Complete System
// ==========================================
class InsideScene extends BaseGameScene {
    constructor() { super('InsideScene'); }

    init(data) {
        this.spawnName = data.spawnPoint || 'player_inside_center';
        this.skillsCount = 0;
        this.lives = CONFIG.maxLives;
        this.currentBook = null;
        this.currentClass = null;
        this.currentCoffee = null;
        this.quest = this.generateRandomQuest();
    }

    preload() {
        this.load.tilemapTiledJSON('inside_map', 'assets/Inside.json');
        ['CIT', 'CIT1', 'classes', 'classroom', 'coffe', 'office', 'Park', 'preview_signs', 'stairs_preview', 'CIT2', 'CIT11']
            .forEach((t, i) => this.load.image(`tiles_in_${i}`, `assets/${t}.png`));
        this.load.spritesheet('npc_teacher', 'assets/teacher.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('npc_student', 'assets/students.png', { frameWidth: 64, frameHeight: 64 });
    }

    create() {
        const map = this.make.tilemap({ key: 'inside_map' });
        const sets = ['CIT', 'CCIT', 'Class', 'classroom', 'coffe', 'Office', 'park', 'Road', 'staircase', 'CIT2', 'CIT11']
            .map((n, i) => map.addTilesetImage(n, `tiles_in_${i}`));

        ['Building_Floor', 'Hallways', 'Classrooms', 'Cafe', 'Walls', 'Furniture'].forEach(l => map.createLayer(l, sets));
        const collisionLayer = map.createLayer('Collision', sets).setVisible(false);

        const spawn = map.findObject('Objects', obj => obj.name === this.spawnName);
        this.setupPlayer(spawn ? spawn.x : 900, spawn ? spawn.y : 1100, 'player');
        this.setupCollision(this.player, collisionLayer);

        Utils.createLPCAnims(this, 'npc_teacher');
        Utils.createLPCAnims(this, 'npc_student');
        this.npcList = [];

        const npcTypes = {
            'npc_student': 'npc_student', 'npc_student2': 'npc_student',
            'npc_student22': 'npc_student', 'teacher': 'npc_teacher', 'teacher1': 'npc_teacher'
        };

        map.getObjectLayer('Objects').objects.forEach(obj => {
            if (npcTypes[obj.name]) {
                const npc = this.physics.add.sprite(obj.x, obj.y, npcTypes[obj.name]);
                npc.setScale(1.2).setDepth(99);
                npc.body.setSize(30, 30).setOffset(17, 25);
                npc.setCollideWorldBounds(true);
                this.setupCollision(npc, collisionLayer);
                this.physics.add.collider(npc, this.player);

                const zoneObj = map.findObject('Objects', o => o.name === `zone_${obj.name}`);
                if (zoneObj) {
                    npc.dataZone = { x: zoneObj.x, y: zoneObj.y, w: zoneObj.width, h: zoneObj.height };
                    npc.isWaiting = false;
                    this.processZoneAI(npc);
                }
                this.npcList.push(npc);
            }
        });

        this.mapData = map;
        this.collisionLayerData = collisionLayer;
        
        this.createAudioContext();
        this.createUI();
        
        this.spawnBook(map);
        this.spawnClass(map);
        this.scheduleCoffee();
        this.startCollectionTimer();

        const exits = { 'exit_r': 'exit_right', 'exit_c': 'exit_center', 'exit_l': 'exit_left' };
        map.getObjectLayer('Objects').objects.forEach(obj => {
            if (exits[obj.name]) {
                const zone = this.add.zone(obj.x + obj.width / 2, obj.y + obj.height / 2, obj.width, obj.height);
                this.physics.world.enable(zone);
                this.physics.add.overlap(this.player, zone, () => {
                    if (this.cursors.down.isDown || this.vKeys.down) {
                        this.scene.start('TransitionScene', { targetScene: 'OutsideScene', spawnPoint: exits[obj.name] });
                    }
                });
            }
        });

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.createVirtualControls();
    }

    createAudioContext() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        this.createCollectSound = () => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
            gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
            osc.start(this.audioContext.currentTime);
            osc.stop(this.audioContext.currentTime + 0.2);
        };

        this.createWarningSound = () => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(400, this.audioContext.currentTime);
            gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
            osc.start(this.audioContext.currentTime);
            osc.stop(this.audioContext.currentTime + 0.15);
        };
    }

    createUI() {
        const leftPanel = this.add.graphics();
        leftPanel.fillStyle(CONFIG.colors.primary, 0.75);
        leftPanel.fillRoundedRect(10, 10, 350, 200, 15);
        leftPanel.lineStyle(4, CONFIG.colors.lighter, 1);
        leftPanel.strokeRoundedRect(10, 10, 350, 200, 15);
        leftPanel.setScrollFactor(0).setDepth(999);

        this.skillsText = this.add.text(30, 30, 'SKILLS: 0', {
            fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '42px', fontStyle: 'bold', color: '#EEEEEE'
        }).setScrollFactor(0).setDepth(1000);

        this.timerText = this.add.text(30, 85, 'TIME: 10s', {
            fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '36px', color: '#76885B'
        }).setScrollFactor(0).setDepth(1000);

        this.livesText = this.add.text(30, 140, '❤️ '.repeat(CONFIG.maxLives), {
            fontSize: '32px'
        }).setScrollFactor(0).setDepth(1000);

        const rightPanel = this.add.graphics();
        rightPanel.fillStyle(CONFIG.colors.secondary, 0.75);
        rightPanel.fillRoundedRect(1550, 10, 360, 280, 15);
        rightPanel.lineStyle(4, CONFIG.colors.lighter, 1);
        rightPanel.strokeRoundedRect(1550, 10, 360, 280, 15);
        rightPanel.setScrollFactor(0).setDepth(999);

        this.add.text(1730, 30, 'QUESTS', {
            fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '38px', fontStyle: 'bold', color: '#EEEEEE'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(1000);

        this.questText = this.add.text(1730, 150, this.getQuestText(), {
            fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '28px', color: '#DDDDDD',
            align: 'center', wordWrap: { width: 320 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
    }

    generateRandomQuest() {
        const types = ['books', 'classes', 'coffee'];
        const type = Phaser.Utils.Array.GetRandom(types);
        const amounts = { books: [3, 5, 7], classes: [2, 3, 4], coffee: [1, 2, 3] };
        return { type: type, target: Phaser.Utils.Array.GetRandom(amounts[type]), current: 0 };
    }

    getQuestText() {
        const icons = { books: '📚', classes: '📋', coffee: '☕' };
        const names = { books: 'Books', classes: 'Classes', coffee: 'Coffee' };
        
        if (this.quest.current >= this.quest.target) {
            return `✅ COMPLETED!\n${icons[this.quest.type]} ${this.quest.current}/${this.quest.target} ${names[this.quest.type]}`;
        }
        return `${icons[this.quest.type]} Collect ${this.quest.target} ${names[this.quest.type]}\nProgress: ${this.quest.current}/${this.quest.target}`;
    }

    updateQuest(type) {
        if (this.quest.type === type) {
            this.quest.current++;
            if (this.quest.current >= this.quest.target) {
                this.time.delayedCall(2000, () => {
                    this.quest = this.generateRandomQuest();
                    this.questText.setText(this.getQuestText());
                });
            }
            this.questText.setText(this.getQuestText());
        }
    }

    startCollectionTimer() {
        this.warningPlayed = false;
        let timeLeft = CONFIG.collectTimeLimit / 1000;
        if (this.collectionTimer) this.collectionTimer.remove();
        
        this.collectionTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                timeLeft--;
                this.timerText.setText(`TIME: ${timeLeft}s`);
                
                if (timeLeft === CONFIG.warningTime && !this.warningPlayed) {
                    this.createWarningSound();
                    this.warningPlayed = true;
                    this.timerText.setColor('#FF4444');
                }
                
                if (timeLeft <= 0) this.loseLife();
            },
            repeat: timeLeft - 1
        });
    }

    loseLife() {
        this.lives--;
        this.livesText.setText('❤️ '.repeat(Math.max(0, this.lives)));
        
        if (this.lives <= 0) {
            this.scene.start('GameOverScene');
        } else {
            this.timerText.setColor('#76885B');
            this.startCollectionTimer();
        }
    }

    resetTimer() {
        if (this.collectionTimer) this.collectionTimer.remove();
        this.timerText.setColor('#76885B');
        this.startCollectionTimer();
    }

    spawnItem(layerName, icon, callback) {
        const layer = this.mapData.getLayer(layerName);
        if (!layer) return null;
        
        const tilemapLayer = layer.tilemapLayer;
        let attempts = 0, item = null;

        do {
            const tiles = tilemapLayer.getTilesWithin(0, 0, tilemapLayer.width, tilemapLayer.height)
                .filter(tile => tile.index !== -1);
            
            if (tiles.length === 0) return null;
            
            const tile = Phaser.Utils.Array.GetRandom(tiles);
            const x = tile.getCenterX();
            const y = tile.getCenterY();
            
            if (this.isWalkable(x, y, this.mapData)) {
                if (icon.includes('fill')) {
                    item = this.add.graphics({ x, y });
                    item.fillStyle(0xFFAA00, 1);
                    item.fillRect(-20, -30, 40, 50);
                    item.fillStyle(0xFFFFFF, 1);
                    [5, 15, 25].forEach(offset => item.fillRect(-15, -offset, 30, 5));
                } else {
                    item = this.add.text(x, y, icon, { fontSize: '48px' });
                }
                
                this.physics.add.existing(item);
                item.body.setSize(icon.includes('fill') ? 40 : 48, icon.includes('fill') ? 50 : 48);
                item.setDepth(90);
                
                this.tweens.add({ targets: item, y: y - 10, duration: 500, yoyo: true, repeat: -1 });
                this.physics.add.overlap(this.player, item, callback);
                break;
            }
            attempts++;
        } while (attempts < 50);

        return item;
    }

    spawnBook(map) {
        if (this.currentBook) this.currentBook.destroy();
        this.currentBook = this.spawnItem('Hallways', 'fill', (p, b) => this.collectBook(b));
    }

    spawnClass(map) {
        if (this.currentClass) this.currentClass.destroy();
        this.currentClass = this.spawnItem('Classrooms', '📋', (p, c) => this.collectClass(c));
    }

    scheduleCoffee() {
        this.time.addEvent({
            delay: CONFIG.coffeeSpawnInterval,
            callback: () => {
                if (!this.currentCoffee) this.spawnCoffee(this.mapData);
            },
            loop: true
        });
    }

    spawnCoffee(map) {
        if (this.currentCoffee) return;
        this.currentCoffee = this.spawnItem('Cafe', '☕', (p, c) => this.collectCoffee(c));
    }

    isWalkable(x, y, map) {
        const collisionLayer = map.getLayer('Collision').tilemapLayer;
        const tile = collisionLayer.getTileAtWorldXY(x, y);
        return !tile || tile.index === -1;
    }

    collectBook(book) {
        book.destroy();
        this.currentBook = null;
        this.skillsCount++;
        this.skillsText.setText(`SKILLS: ${this.skillsCount}`);
        this.createCollectSound();
        this.updateQuest('books');
        this.resetTimer();
        this.time.delayedCall(CONFIG.itemSpawnDelay, () => this.spawnBook(this.mapData));
    }

    collectClass(classIcon) {
        classIcon.destroy();
        this.currentClass = null;
        this.skillsCount++;
        this.skillsText.setText(`SKILLS: ${this.skillsCount}`);
        this.createCollectSound();
        this.updateQuest('classes');
        this.resetTimer();
        this.time.delayedCall(CONFIG.itemSpawnDelay, () => this.spawnClass(this.mapData));
    }

    collectCoffee(coffee) {
        coffee.destroy();
        this.currentCoffee = null;
        
        if (this.lives < CONFIG.maxLives) {
            this.lives++;
            this.livesText.setText('❤️ '.repeat(this.lives));
        }
        
        this.createCollectSound();
        this.updateQuest('coffee');
    }

    processZoneAI(npc) {
        if (npc.isWaiting || !npc.dataZone) return;

        const targetX = npc.dataZone.x + Math.random() * npc.dataZone.w;
        const targetY = npc.dataZone.y + Math.random() * npc.dataZone.h;
        this.physics.moveTo(npc, targetX, targetY, CONFIG.npcSpeed);
        
        let lastX = npc.x, lastY = npc.y, stuckCounter = 0;

        const checkEvent = this.time.addEvent({
            delay: 100,
            callback: () => {
                const movedDistance = Phaser.Math.Distance.Between(lastX, lastY, npc.x, npc.y);
                if (movedDistance < 2) {
                    stuckCounter++;
                    if (stuckCounter > 3) {
                        npc.setVelocity(0);
                        npc.anims.stop();
                        npc.isWaiting = true;
                        checkEvent.remove();
                        this.time.delayedCall(200, () => {
                            npc.isWaiting = false;
                            this.processZoneAI(npc);
                        });
                        return;
                    }
                } else {
                    stuckCounter = 0;
                }
                
                lastX = npc.x;
                lastY = npc.y;

                const dist = Phaser.Math.Distance.Between(npc.x, npc.y, targetX, targetY);
                const { x: vx, y: vy } = npc.body.velocity;
                const tex = npc.texture.key;

                if (Math.abs(vx) > Math.abs(vy)) {
                    npc.anims.play(vx > 0 ? `${tex}_walk_right` : `${tex}_walk_left`, true);
                } else {
                    npc.anims.play(vy > 0 ? `${tex}_walk_down` : `${tex}_walk_up`, true);
                }

                if (dist < 10) {
                    npc.setVelocity(0);
                    npc.anims.stop();
                    npc.isWaiting = true;
                    checkEvent.remove();
                    this.time.delayedCall(Phaser.Math.Between(1000, 3000), () => {
                        npc.isWaiting = false;
                        this.processZoneAI(npc);
                    });
                }
            },
            loop: true
        });
    }

    update() { 
        this.updatePlayerMovement();
    }
}

// ==========================================
// Game Configuration
// ==========================================
const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1280,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MenuScene, TransitionScene, OutsideScene, InsideScene, GameOverScene]
};

const game = new Phaser.Game(config);