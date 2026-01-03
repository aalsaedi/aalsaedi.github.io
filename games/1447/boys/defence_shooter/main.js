    
var GameScene = {
  key: "GameScene",
  preload: preload,
  create: create,
  update: update
};
    
    const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    backgroundColor: "#2222",
    physics: {
        default: "arcade",
        arcade: { debug: false }
    },
    scene:[MenuScene,TutorialScene,  GameScene]
};

let game = new Phaser.Game(config);

// Global Variables
let tower, enemies, bullets;
let bulletDamage = 17.5;
let wave = 1;
let enemiesLeft = 0;
let spawnTimer = 0;
let fireRate = 1800;
let keys;

// Tower Stats
let towerHealth = 100;
let maxTowerHealth = 100;
let healthText;

// Menu System
let isMenuOpen = false;
let menuText = [];
let selectedOption = 0;
const menuOptions = ["Continue", "Shop"];

// Economy
let gold = 0;
let goldText, waveText;

// Ammo System
let currentAmmo = 6;
let maxAmmo = 6;
let ammoText;

// Music System
let musicTracks = [];
let currentMusic = null;

// Quick Time Event System
let qteActive = false;
let qteCircle, qteZone, qteTimer;
let qteTimeLimit = 2000;

//boss variables
let boss;
let bossActive = false;



function preload() {
    //tower
    this.load.image('tower', 'tower.png');
    //enemy
    this.load.image('enemy', 'enemy.png');
    //bullet
    this.load.image('bullet', 'bullet.png');
    //background
    this.load.image('background', 'background.png');
    //music
     this.load.audio('MainST', 'MainST.mp3');
    this.load.audio('MainST-NoteC', 'MainST-NoteC.mp3');
    this.load.audio('MainST-NoteD', 'MainST-NoteD.mp3');
}


function create() {
    //check Utils.js
 this.menuMusic = this.sound.add('MainST', { 
    volume: 0.05, 
    loop: true 
    });
    this.menuMusic.play();


    // Create tower
    tower = this.physics.add.sprite(405, 275, 'tower');
    tower.setScale(4);
    tower.body.setImmovable(true);

    enemies = this.physics.add.group();
    bullets = this.physics.add.group();
    items = this.physics.add.group();
    this.items = items;


    // Collisions
    this.physics.add.overlap(bullets, enemies, bulletHitEnemy, null, this);

    
    keys = this.input.keyboard.addKeys({
        // Input for shop 
        up: "UP",
        down: "DOWN",
        space: "SPACE",
        //R for reload
        r: "R"
    });

    // UI Display
    createUI.call(this);

    // Store scene references
    this.goldText = goldText;
    this.waveText = waveText;
    this.healthText = healthText;
    this.ammoText = ammoText;
    this.tower = tower;
    this.enemies = enemies;
    this.bullets = bullets;
    
    // Game state
    this.gold = gold;
    this.wave = wave;
    this.fireRate = fireRate;
    this.goldPerKill = 5;
    this.isMenuOpen = false;
    this.shopOpen = false;
    this.enemiesLeft = 0;
    this.spawnTimer = 0;
    this.lastShot = 0;
    this.bulletDamage = bulletDamage;
    this.currentAmmo = currentAmmo;
    this.maxAmmo = maxAmmo;

    
    let background = this.add.image(435, 330, 'background');
    background.setDepth(-1);

    startWave.call(this);

}

function createUI() {
    goldText = this.add.text(10, 10, `Gold: ${gold}`, { 
        fontSize: "20px", 
        fill: "#ffd700" 
    });
    
    waveText = this.add.text(10, 35, `Wave: ${wave}`, { 
        fontSize: "20px", 
        fill: "#00ff00" 
    });
    
    healthText = this.add.text(10, 60, `Health: ${towerHealth}/${maxTowerHealth}`, { 
        fontSize: "20px", 
        fill: "#ff4444" 
    });
    
    ammoText = this.add.text(10, 85, `Ammo: ${currentAmmo}/${maxAmmo}`, { 
        fontSize: "18px", 
        fill: "#ffaa00" 
    });
    
    this.bulletDamageText = this.add.text(10, 105, `Damage: ${bulletDamage}`, { 
        fontSize: "18px", 
        fill: "#ff8800" 
    });
    
    this.fireRateText = this.add.text(10, 125, `Fire Rate: ${(1000/fireRate).toFixed(1)}/s`, { 
        fontSize: "18px", 
        fill: "#8888ff" 
    });
    
    this.enemyHpText = this.add.text(10, 145, `Enemy HP: ${10 + Math.floor(wave * 5)}`, { 
        fontSize: "18px", 
        fill: "#ff44ff" 
    });
}


function startWave() {
    this.isMenuOpen = false;
    this.shopOpen = false;
    isMenuOpen = false;
    
    clearMenu.call(this);

    // Check if boss wave
    if (this.wave % 5 === 0) {
        spawnBoss.call(this);
        this.enemiesLeft = 0; 
    } else {
        this.enemiesLeft = this.wave * 3 + 1;
    }
    enemiesLeft = this.enemiesLeft;

    this.gold += this.wave * 2;
    gold = this.gold;
    
    goldText.setText(`Gold: ${gold}`);
    waveText.setText(`Wave: ${this.wave}`);
    healthText.setText(`Health: ${towerHealth}/${maxTowerHealth}`);
    this.enemyHpText.setText(`Enemy HP: ${10 + Math.floor(this.wave * 7)}`);

    
    // Update stats display
    updateStatsDisplay(this);
}


function spawnBoss() {
    bossActive = true;
    
    boss = this.physics.add.sprite(400, -100, 'enemy'); 
    boss.setScale(5); 
    boss.hp = 200 + this.wave * 20; 
    boss.speed = 20; 
    this.enemies.add(boss);
    
    this.physics.moveTo(boss, 400, 300, boss.speed);

    let bossText = this.add.text(400, 50, "BOSS WAVE!", { 
        fontSize: "32px", 
        color: "#ff0000" 
    }).setOrigin(0.5);

    this.time.delayedCall(1500, () => bossText.destroy());
}

//items from the boss 

function spawnBossDrops() {
    let x = boss.x;
    let y = boss.y;

    for (let i = 0; i < 3; i++) {
        let itemData = Phaser.Utils.Array.GetRandom(ITEMS);

        let drop = this.physics.add.sprite(
            x + Phaser.Math.Between(-30, 30),
            y + Phaser.Math.Between(-30, 30),
            itemData.key
        );

        drop.setScale(1.5);
        drop.itemInfo = itemData; // <-- store stats inside sprite
        drop.setData("item", itemData);

        // Optional bounce/fall animation
        this.tweens.add({
            targets: drop,
            y: drop.y - 20,
            duration: 400,
            yoyo: true
        });

        // Add to item group
        this.items.add(drop);
    }
}



function update(time) {
    if (!this.isMenuOpen && !this.shopOpen) {
        spawnEnemies.call(this, time);
        shootEnemies.call(this, time);
        checkTowerCollisions.call(this);
        
        // QTE input
        if (qteActive && Phaser.Input.Keyboard.JustDown(keys.r)) {
            handleQTESuccess.call(this);
        }
        
        // Manual reload
        if (!qteActive && this.currentAmmo <= 0 && Phaser.Input.Keyboard.JustDown(keys.r)) {
            manualReload.call(this);
        }
    } else if (this.isMenuOpen && !this.shopOpen) {
        handleMenuInput.call(this);
    }
}

// Spawn Enemies 
function spawnEnemies(time) {
    if (bossActive) return; // Skip normal enemies if boss is active

    if (this.enemiesLeft > 0 && time > this.spawnTimer) {
        this.spawnTimer = time + 1000;

        const side = Math.floor(Math.random() * 4);
        let x, y;

        switch(side) {
            case 0: x = 400; y = -50; break;
            case 1: x = 400; y = 650; break;
            case 2: x = -50; y = 300; break;
            case 3: x = 850; y = 300; break;
        }

        let enemy = this.physics.add.sprite(x, y, 'enemy');
        this.enemies.add(enemy);
        enemy.setScale(3);
        enemy.speed = 50;
        enemy.hp = 10 + Math.floor(this.wave * 7);
        
        this.physics.moveTo(enemy, 400, 300, enemy.speed);
        this.enemiesLeft--;
    }

    if (this.enemies.countActive() === 0 && this.enemiesLeft === 0 && !this.isMenuOpen && !this.shopOpen && !bossActive) {
        openMenu.call(this);
    }
}


// Check Tower Collisions loses hp  when tower collides with an enemy
function checkTowerCollisions() {
    this.enemies.getChildren().forEach(enemy => {
        if (!enemy.active) return;
        
        const distance = Phaser.Math.Distance.Between(tower.x, tower.y, enemy.x, enemy.y);
        
        if (distance < 50) {
            towerHealth -= 10;
            healthText.setText(`Health: ${towerHealth}/${maxTowerHealth}`);
            enemy.destroy();
            
            if (towerHealth <= 0) {
                towerHealth = 0;
                healthText.setText(`Health: 0/${maxTowerHealth}`);
                gameOver.call(this);
            }
        }
    });
}

//TODO: add wasd movement for direction for more user interaction 
function shootEnemies(time) {
    if (this.currentAmmo <= 0) return;
    if (time < this.lastShot + this.fireRate) return;

    let target = this.enemies.getFirstAlive();
    if (!target) return;

    let bullet = this.physics.add.sprite(this.tower.x, this.tower.y, 'bullet');
    this.bullets.add(bullet);
    bullet.setScale(2);
    bullet.damage = this.bulletDamage;
    
    let angle = Phaser.Math.Angle.Between(this.tower.x, this.tower.y, target.x, target.y);
    bullet.rotation = angle;
    this.physics.velocityFromRotation(angle, 300, bullet.body.velocity);

    this.lastShot = time;
    
    // Use ammo
    this.currentAmmo--;
    currentAmmo = this.currentAmmo;
    this.ammoText.setText(`Ammo: ${this.currentAmmo}/${this.maxAmmo}`);
    
    // Trigger QTE when out of ammo
    if (this.currentAmmo <= 0 && !qteActive) {
        startQTE.call(this);
    }
}

// Manual Reload
function manualReload() {
    let reloadText = this.add.text(this.tower.x, this.tower.y - 100, "RELOADING...", {
        fontSize: "18px",
        color: "#ffff00",
        fontFamily: "Arial",
        stroke: "#000000",
        strokeThickness: 2
    }).setOrigin(0.5);
    
    this.time.delayedCall(1000, () => {
        this.currentAmmo = this.maxAmmo;
        this.ammoText.setText(`Ammo: ${this.currentAmmo}/${this.maxAmmo}`);
        reloadText.destroy();
    });
}

// Quick Time Event 
function startQTE() {
    qteActive = true;
    
    const qteX = this.tower.x;
    const qteY = this.tower.y - 80;
    
    // Create QTE visuals
    qteCircle = this.add.circle(qteX, qteY, 30, 0x00ffff, 0);
    qteCircle.setStrokeStyle(3, 0x00ffff);
    
    qteTimer = this.add.circle(qteX, qteY, 25, 0x00ffff, 0);
    qteTimer.setStrokeStyle(2, 0x8B4513);
    
    qteZone = this.add.zone(qteX, qteY, 80, 80);
    this.physics.add.existing(qteZone);
    qteZone.body.setCircle(40);
    
    // Timer animation
    this.tweens.add({
        targets: qteTimer,
        scaleX: 0,
        scaleY: 0,
        duration: qteTimeLimit,
        ease: 'Linear',
        onComplete: function() {
            if (qteActive) handleQTEFailure.call(this);
        },
        callbackScope: this
    });
    
    let instructionText = this.add.text(qteX, qteY + 50, "PRESS R", {
        fontSize: "16px",
        color: "#ffff00",
        fontFamily: "Arial",
        stroke: "#000000",
        strokeThickness: 2
    }).setOrigin(0.5);
    
    this.time.delayedCall(1500, () => instructionText.destroy());
}

function handleQTESuccess() {
    if (!qteActive) return;
    
    qteActive = false;
    cleanUpQTE.call(this);
    
    let successText = this.add.text(this.tower.x, this.tower.y - 120, "FAST RELOAD!", {
        fontSize: "18px",
        color: "#00ff00",
        fontFamily: "Arial",
        stroke: "#000000",
        strokeThickness: 2
    }).setOrigin(0.5);
    
    this.currentAmmo = this.maxAmmo;
    this.ammoText.setText(`Ammo: ${this.currentAmmo}/${this.maxAmmo}`);
    
    this.time.delayedCall(800, () => successText.destroy());
}

function handleQTEFailure() {
    if (!qteActive) return;
    
    qteActive = false;
    cleanUpQTE.call(this);
    
    let failureText = this.add.text(this.tower.x, this.tower.y - 120, "SLOW RELOAD", {
        fontSize: "18px",
        color: "#ff0000",
        fontFamily: "Arial",
        stroke: "#000000",
        strokeThickness: 2
    }).setOrigin(0.5);
    
    this.time.delayedCall(1000, () => {
        this.currentAmmo = this.maxAmmo;
        this.ammoText.setText(`Ammo: ${this.currentAmmo}/${this.maxAmmo}`);
        failureText.destroy();
    });
}

function cleanUpQTE() {
    if (qteCircle) qteCircle.destroy();
    if (qteZone) qteZone.destroy();
    if (qteTimer) qteTimer.destroy();
    
    qteCircle = null;
    qteZone = null;
    qteTimer = null;
}

// Bullet hits enemy  
function bulletHitEnemy(bullet, enemy) {
    createHitAnimation.call(this, enemy.x, enemy.y);
    
    enemy.hp -= bullet.damage;
    bullet.destroy();
    
    enemy.setScale(enemy.scale); 
    this.tweens.add({
        targets: enemy,
        scale: enemy.scale,
        duration: 150,
        ease: 'Back.easeOut'
    });
    
    if (enemy.hp <= 0) {
        createExplosion.call(this, enemy.x, enemy.y);
        this.gold += this.goldPerKill;
        gold = this.gold;
        goldText.setText(`Gold: ${gold}`);
        
        if (bossActive && enemy === boss) {
            bossActive = false;
            boss.destroy();
            openMenu.call(this); // End boss wave
        } else {
            enemy.destroy();
        }
    }
}


// Hit Animation 
function createHitAnimation(x, y) {
    let hitEffect = this.add.circle(x, y, 8, 0xffff00, 4);
    
    this.tweens.add({
        targets: hitEffect,
        scale: 4,
        alpha: 0,
        duration: 200,
        ease: 'Power2',
        onComplete: () => hitEffect.destroy()
    });
}

// Explosion Animation 
function createExplosion(x, y) {
    let explosion = this.add.circle(x, y, 5, 0xff0000, 0.9);
    
    this.tweens.add({
        targets: explosion,
        scale: 3,
        alpha: 0,
        duration: 400,
        ease: 'Power2',
        onComplete: () => explosion.destroy()
    });
}

//Game Over
function gameOver() {
    this.isMenuOpen = true;
    
    menuText.push(this.add.rectangle(400, 300, 400, 200, 0x000000, 0.8));
    menuText.push(this.add.text(400, 250, "GAME OVER", { 
        fontSize: "32px", 
        color: "#ff0000" 
    }).setOrigin(0.5));
    menuText.push(this.add.text(400, 300, `Survived to Wave ${wave}`, { 
        fontSize: "20px", 
        color: "#fff" 
    }).setOrigin(0.5));
    menuText.push(this.add.text(400, 350, "Press R to Restart", { 
        fontSize: "18px", 
        color: "#ffff00" 
    }).setOrigin(0.5));
    // For restarting 'R'
    this.input.keyboard.once('keydown-R', () => {
        wave = 1;
        gold = 0;
        towerHealth = 100;
        maxTowerHealth = 100;
        bulletDamage = 10;
        currentAmmo = 6;
        maxAmmo = 6;
        qteActive = false;
        isMenuOpen = false;
        shopOpen = false;
        clearMenu.call(this);
        this.scene.restart();
    });
}

// Menu System 
function openMenu() {
    this.isMenuOpen = true;
    isMenuOpen = true;
    selectedOption = 0;

    menuText.push(this.add.text(300, 200, `Wave ${this.wave} Complete!`, { 
        fontSize: "28px", 
        color: "#fff" 
    }));

    menuOptions.forEach((opt, i) => {
        let t = this.add.text(320, 260 + i * 40, opt, { 
            fontSize: "22px", 
            color: "#aaa" 
        });
        menuText.push(t);
    });

    highlightMenu();
}

function clearMenu() {
    menuText.forEach(t => t.destroy());
    menuText = [];
}

function highlightMenu() {
    menuText.forEach((t, i) => {
        if (i === selectedOption + 1) t.setColor("#0f0");
        else if (i > 0) t.setColor("#aaa");
    });
}

function handleMenuInput() {
    if (Phaser.Input.Keyboard.JustDown(keys.up)) {
        selectedOption = (selectedOption - 1 + menuOptions.length) % menuOptions.length;
        highlightMenu();
    }
    if (Phaser.Input.Keyboard.JustDown(keys.down)) {
        selectedOption = (selectedOption + 1) % menuOptions.length;
        highlightMenu();
    }
    if (Phaser.Input.Keyboard.JustDown(keys.space)) chooseMenuOption.call(this);
}

function chooseMenuOption() {
    if (menuOptions[selectedOption] === "Continue") {
        this.wave++;
        wave = this.wave;
        startWave.call(this);
    } else {
        clearMenu.call(this);
        this.isMenuOpen = false;
        this.shopOpen = true;
        openShop(this);
    }
}

//Update Stats Display usef for debugging 
function updateStatsDisplay(scene) {
    if (scene.bulletDamageText) {
        scene.bulletDamageText.setText(`Damage: ${scene.bulletDamage}`);
    }
    if (scene.fireRateText) {
        scene.fireRateText.setText(`Fire Rate: ${(1000/scene.fireRate).toFixed(1)}/s`);
    }
    if (scene.healthText) {
        scene.healthText.setText(`Health: ${towerHealth}/${maxTowerHealth}`);
    }
    if (scene.ammoText) {
        scene.ammoText.setText(`Ammo: ${scene.currentAmmo}/${scene.maxAmmo}`);
    }
}