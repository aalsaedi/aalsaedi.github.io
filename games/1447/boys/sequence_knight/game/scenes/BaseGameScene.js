class BaseGameScene extends Phaser.Scene {
    constructor(sceneKey) {
        super(sceneKey);
    }

    // preload() method to load common assets
    preloadCommonAssets() {
        // Player SpriteSheets
        {
            this.load.spritesheet("mc_idle", "assets/spritesheets/mc/Idle.png", { frameWidth: 128, frameHeight: 128 });
            this.load.spritesheet("mc_walk", "assets/spritesheets/mc/Walk.png", { frameWidth: 128, frameHeight: 128 });
            this.load.spritesheet("mc_run", "assets/spritesheets/mc/Run.png", { frameWidth: 128, frameHeight: 128 });
            this.load.spritesheet("mc_jump", "assets/spritesheets/mc/Jump.png", { frameWidth: 128, frameHeight: 128 });
            this.load.spritesheet("mc_attack1", "assets/spritesheets/mc/Attack 1.png", { frameWidth: 128, frameHeight: 128 });
            this.load.spritesheet("mc_attack2", "assets/spritesheets/mc/Attack 2.png", { frameWidth: 128, frameHeight: 128 });
            this.load.spritesheet("mc_attack3", "assets/spritesheets/mc/Attack 3.png", { frameWidth: 128, frameHeight: 128 });
            this.load.spritesheet("mc_defend", "assets/spritesheets/mc/Defend.png", { frameWidth: 128, frameHeight: 128 });
            this.load.spritesheet("mc_protect", "assets/spritesheets/mc/Protect.png", { frameWidth: 128, frameHeight: 128 });
            this.load.spritesheet("mc_hurt", "assets/spritesheets/mc/Hurt.png", { frameWidth: 128, frameHeight: 128 });
            this.load.spritesheet("mc_dead", "assets/spritesheets/mc/Dead.png", { frameWidth: 128, frameHeight: 128 });
            this.load.spritesheet("mc_run_attack", "assets/spritesheets/mc/Run+Attack.png", { frameWidth: 128, frameHeight: 128 });
        }

        // Player Audio
        {
            this.load.audio('slice', 'assets/audio/slice.mp3');
            this.load.audio('slash1', 'assets/audio/slash1.mp3');
            this.load.audio('slash2', 'assets/audio/slash2.mp3');
            this.load.audio('slash3', 'assets/audio/slash3.mp3');
            this.load.audio('dash-slice', 'assets/audio/dash-slice.mp3');
            this.load.audio('defend', 'assets/audio/defend.mp3');
            this.load.audio('flesh-slice', 'assets/audio/flesh-slice.mp3');
            this.load.audio('running', 'assets/audio/running.mp3');
        }
        //Skeleton spritesheets
        {
            this.load.spritesheet("skel_attack", "assets/spritesheets/skeleton/skeleton_attack.png", { frameWidth: 64, frameHeight: 64 });
            this.load.spritesheet("skel_dying", "assets/spritesheets/skeleton/skeleton_dying.png", { frameWidth: 64, frameHeight: 64 });
            this.load.spritesheet("skel_walk", "assets/spritesheets/skeleton/skeleton_moving.png", { frameWidth: 64, frameHeight: 64 });
            this.load.spritesheet("skel_idle", "assets/spritesheets/skeleton/skeleton_idle.png", { frameWidth: 64, frameHeight: 64 });
            this.load.spritesheet("skel_hurt", "assets/spritesheets/skeleton/skeleton_damage.png", { frameWidth: 64, frameHeight: 64 });
        }
        //Skeleton Audio
        {
            this.load.audio('mace', 'assets/audio/mace.mp3');
            this.load.audio('mace-hit', 'assets/audio/mace-hit.mp3');
        }
        
        // Boss spritesheets
        {   
            this.load.spritesheet("boss_idle", "assets/spritesheets/boss/Idle.png", { frameWidth: 170, frameHeight: 96 });
            this.load.spritesheet("boss_walk", "assets/spritesheets/boss/Walk.png", { frameWidth: 170, frameHeight: 96 });
            this.load.spritesheet("boss_attack", "assets/spritesheets/boss/Attack.png", { frameWidth: 170, frameHeight: 96 });
            this.load.spritesheet("boss_spin", "assets/spritesheets/boss/SpinAttack.png", { frameWidth: 170, frameHeight: 96 });
            this.load.spritesheet("boss_taunt", "assets/spritesheets/boss/Taunt.png", { frameWidth: 170, frameHeight: 96 });
            this.load.spritesheet("boss_dash", "assets/spritesheets/boss/Dash.png", { frameWidth: 170, frameHeight: 96 });
            this.load.spritesheet("boss_dead", "assets/spritesheets/boss/Death.png", { frameWidth: 170, frameHeight: 96 });
        }

        //Boss Audio
        {
            this.load.audio('air-slice', 'assets/audio/air-slice.mp3');
            this.load.audio('ground', 'assets/audio/ground.mp3');
            this.load.audio('spinning', 'assets/audio/spinning.mp3');
            this.load.audio('taunt', 'assets/audio/taunt.mp3');
            this.load.audio('dash', 'assets/audio/dash.mp3');
        }

    }

    createCommon() {
        if (!this.anims.exists("anim_idle")) {
            // Player animations
            this.anims.create({ key: "anim_idle", frames: this.anims.generateFrameNumbers("mc_idle", { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
            this.anims.create({ key: "anim_walk", frames: this.anims.generateFrameNumbers("mc_walk", { start: 0, end: 7 }), frameRate: 12, repeat: -1 });
            this.anims.create({ key: "anim_run", frames: this.anims.generateFrameNumbers("mc_run", { start: 0, end: 6 }), frameRate: 15, repeat: -1 });
            this.anims.create({ key: "anim_jump", frames: this.anims.generateFrameNumbers("mc_jump", { start: 0, end: 5 }), frameRate: 5, repeat: 0 });
            this.anims.create({ key: "anim_attack1", frames: this.anims.generateFrameNumbers("mc_attack1", { start: 0, end: 4 }), frameRate: 12, repeat: 0 });
            this.anims.create({ key: "anim_attack2", frames: this.anims.generateFrameNumbers("mc_attack2", { start: 0, end: 3 }), frameRate: 12, repeat: 0 });
            this.anims.create({ key: "anim_attack3", frames: this.anims.generateFrameNumbers("mc_attack3", { start: 0, end: 3 }), frameRate: 15, repeat: 0 });
            this.anims.create({ key: "anim_defend", frames: this.anims.generateFrameNumbers("mc_defend", { start: 0, end: 4 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: "anim_protect", frames: this.anims.generateFrameNumbers("mc_protect", { start: 0, end: 0 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: "anim_hurt", frames: this.anims.generateFrameNumbers("mc_hurt", { start: 0, end: 1 }), frameRate: 6, repeat: 0 });
            this.anims.create({ key: "anim_dead", frames: this.anims.generateFrameNumbers("mc_dead", { start: 0, end: 5 }), frameRate: 8, repeat: 0 });
            this.anims.create({ key: "anim_run_attack", frames: this.anims.generateFrameNumbers("mc_run_attack", { start: 0, end: 5 }), frameRate: 12, repeat: 0 });

            // Skeleton animations
            this.anims.create({ key: "anim_skel_attack", frames: this.anims.generateFrameNumbers("skel_attack", { start: 0, end: 12 }), frameRate: 15, repeat: 0 });
            this.anims.create({ key: "anim_skel_dead", frames: this.anims.generateFrameNumbers("skel_dying", { start: 0, end: 12 }), frameRate: 8, repeat: 0 });
            this.anims.create({ key: "anim_skel_walk", frames: this.anims.generateFrameNumbers("skel_walk", { start: 0, end: 11 }), frameRate: 12, repeat: -1 });
            this.anims.create({ key: "anim_skel_idle", frames: this.anims.generateFrameNumbers("skel_idle", { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
            this.anims.create({ key: "anim_skel_hurt", frames: this.anims.generateFrameNumbers("skel_hurt", { start: 0, end: 2 }), frameRate: 10, repeat: 0 });

            // Boss animations
            this.anims.create({ key: "anim_boss_idle", frames: this.anims.generateFrameNumbers("boss_idle", { start: 0, end: 15 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: "anim_boss_walk", frames: this.anims.generateFrameNumbers("boss_walk", { start: 0, end: 7 }), frameRate: 12, repeat: -1 });
            this.anims.create({ key: "anim_boss_attack", frames: this.anims.generateFrameNumbers("boss_attack", { start: 0, end: 29 }), frameRate: 20, repeat: 0 });
            this.anims.create({ key: "anim_boss_spin", frames: this.anims.generateFrameNumbers("boss_spin", { start: 0, end: 29 }), frameRate: 24, repeat: 0 });
            this.anims.create({ key: "anim_boss_taunt", frames: this.anims.generateFrameNumbers("boss_taunt", { start: 0, end: 17 }), frameRate: 12, repeat: 0 });
            this.anims.create({ key: "anim_boss_dash", frames: this.anims.generateFrameNumbers("boss_dash", { start: 0, end: 7 }), frameRate: 12, repeat: 0 });
            this.anims.create({ key: "anim_boss_dead", frames: this.anims.generateFrameNumbers("boss_dead", { start: 0, end: 39 }), frameRate: 12, repeat: 0 });
        }

        // Initialize fresh scene-specific data
        this.boss = null;
        this.bossHealthBar = null;
        this.skeletons = [];
        this.isTransitioningToDeath = false;
    }

    //KeyBoard Setup
    setupControls() {
        this.keys = {
            w: this.input.keyboard.addKey('W'),
            a: this.input.keyboard.addKey('A'),
            s: this.input.keyboard.addKey('S'),
            d: this.input.keyboard.addKey('D'),
            f: this.input.keyboard.addKey('F'),
            q: this.input.keyboard.addKey('Q'),
            shift: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
            up: this.input.keyboard.addKey('up'),
            down: this.input.keyboard.addKey('down'),
            left: this.input.keyboard.addKey('left'),
            right: this.input.keyboard.addKey('right')
        };
    }

    // Camera Setup
    setupCamera(worldWidth, worldHeight, zoom = 1) {
        this.myCam = this.cameras.main;

        // Set world bounds
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

        // Set camera bounds to match world bounds
        this.myCam.setBounds(0, 0, worldWidth, worldHeight);

        // Camera zoom before creating UI (in order to set UI positions)
        this.myCam.setZoom(zoom);
    }

    //Player Setup
    setupPlayer(x, y) {
        this.player = new Player(this, x, y);

        // Camera follows player
        this.myCam.startFollow(this.player.sprite, true, 0.01, 0.01);
        this.myCam.setDeadzone(150, 150);

        // Create player UI
        this.playerUI = new PlayerUI(this, this.player);

        return this.player;
    }

    //Ultimates (Sequences) Setup
    setupUltimates() {
        // Track ultimate cooldown states
        this.ultimateStates = {
            light: { ready: true, lastActivated: 0 },
            medium: { ready: true, lastActivated: 0 },
            heavy: { ready: true, lastActivated: 0 }
        };

        // Create three combos
        this.combos = {
            light: this.input.keyboard.createCombo([
                this.keys.up, this.keys.up, this.keys.down, this.keys.down
            ], { resetOnMatch: true, maxKeyDelay: 500 }),
            medium: this.input.keyboard.createCombo([
                this.keys.down, this.keys.down, this.keys.up, this.keys.up
            ], { resetOnMatch: true, maxKeyDelay: 500 }),
            heavy: this.input.keyboard.createCombo([
                this.keys.left, this.keys.right, this.keys.left, this.keys.right
            ], { resetOnMatch: true, maxKeyDelay: 500 })
        };

        // Single listener for all combos
        this.input.keyboard.on('keycombomatch', (combo) => {
            if(this.isSlowMo){
                if (combo === this.combos.light && this.ultimateStates.light.ready) {
                this.activateUltimate('light');
                } else if (combo === this.combos.medium && this.ultimateStates.medium.ready) {
                    this.activateUltimate('medium');
                } else if (combo === this.combos.heavy && this.ultimateStates.heavy.ready) {
                    this.activateUltimate('heavy');
                }
            }
        });
    }

    //Slow Motion Setup
    setupSlowMotion() {
        this.isSlowMo = false;
        this.trailTimer = 0;
        this.trailSprites = [];
    }

    //Update logic for Player ,UI , Slow Motion
    updateBase(time, delta) {
        // Slow motion activation
        if (this.keys.q.isDown && !this.isSlowMo) {
            this.activateSlowMo();
        }

        // Update player
        if (this.player) {
            this.player.update(this.keys, this.isSlowMo, delta);

            // التحقق من موت اللاعب
            if (this.player.health <= 0 && !this.isTransitioningToDeath) {
                this.isTransitioningToDeath = true;

                this.time.delayedCall(2000, () => {
                    this.scene.start('DeathScene');
                });
            }
        }

        // Update UI
        if (this.playerUI) {
            this.playerUI.update();
        }

        // Update trails for slow motion
        if (this.isSlowMo) {
            this.updateTrails(delta);
        }
    }

    //Activate Slow Motion
    activateSlowMo() {
        this.isSlowMo = true;
        this.physics.world.timeScale = GameConfig.slowMotion.timeFactor;

        this.time.delayedCall(GameConfig.slowMotion.duration, () => {
            this.physics.world.timeScale = 1;
            this.isSlowMo = false;
            this.fadeOutTrails();
        });
    }

    //Update Trails (AfterImages) of the player
    updateTrails(delta) {
        this.trailTimer += this.game.loop.delta;
        if (this.trailTimer >= GameConfig.slowMotion.trailDelay) {
            const trail = this.add.sprite(this.player.sprite.x, this.player.sprite.y, this.player.sprite.texture.key);
            trail.setFrame(this.player.sprite.frame.name);
            trail.setScale(this.player.sprite.scaleX, this.player.sprite.scaleY);
            trail.setFlipX(this.player.sprite.flipX);

            // Use ultimate color if active
            if (this.player.isUltimateActive && this.player.currentUltimateType) {
                const ultimateConfig = GameConfig.ultimates[this.player.currentUltimateType];
                trail.setAlpha(ultimateConfig.trailAlpha);
                trail.setTint(ultimateConfig.trailColor);
            } else {
                trail.setAlpha(GameConfig.slowMotion.trailAlpha);
                trail.setTint(GameConfig.slowMotion.trailTint);
            }

            trail.setDepth(this.player.sprite.depth - 1);
            this.trailSprites.push(trail);
            this.trailTimer = 0;
        }
    }

    //Remove Trails after some time
    fadeOutTrails() {
        this.trailTimer = 0;
        if (this.trailSprites.length > 0) {
            this.trailSprites.forEach(trail => {
                if (trail && trail.active) {
                    this.tweens.add({
                        targets: trail,
                        alpha: 0,
                        duration: GameConfig.slowMotion.trailFadeDuration,
                        ease: 'Power2',
                        onComplete: () => trail.destroy()
                    });
                }
            });
            this.trailSprites = [];
        }
    }

    //Activate Ultimates (Sequences)
    activateUltimate(type) {
        const state = this.ultimateStates[type];
        const config = GameConfig.ultimates[type];
        const currentTime = this.time.now;

        // Activate ultimate (Sequence)
        const success = this.player.performUltimate(type);

        if (success) {
            state.ready = false;
            state.lastActivated = currentTime;

            // Screen shake
            this.myCam.shake(
                config.screenShake.duration,
                config.screenShake.intensity
            );

            // Screen flash
            this.createUltimateFlash(config.trailColor);

            // Start cooldown
            this.time.delayedCall(config.cooldown, () => {
                state.ready = true;
            });
        }
    }

    //Flash Effect For Ultimates (Sequences)
    createUltimateFlash(color) {
        const flash = this.add.rectangle(
            this.myCam.width / 2,
            this.myCam.height / 2,
            this.myCam.width,
            this.myCam.height,
            color,
            0.5
        );
        flash.setScrollFactor(0);
        flash.setDepth(1000);

        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => flash.destroy()
        });
    }

    //Create Circle Around enemy if he gets hit with ultimate
    createHitEffect(x, y, ultimateType) {
        const config = GameConfig.ultimates[ultimateType];
        const effect = this.add.circle(x, y, 30, config.trailColor, 0.6);

        this.tweens.add({
            targets: effect,
            scale: 2,
            alpha: 0,
            duration: 400,
            ease: 'Power2',
            onComplete: () => effect.destroy()
        });
    }

    //Both Enemy and player hit box combat
    handleCombat(enemy, enemyConfig) {
        if (!enemy || !enemy.sprite.active) return;

        // Check player attacks hitting enemy
        const playerAttackHitbox = this.player.getLastAttackHitbox();
        if (playerAttackHitbox && enemy.sprite.active && !enemy.isHurt) {
            if (!this.player.hasHitTarget(enemy) && this.physics.overlap(playerAttackHitbox, enemy.sprite)) {
                const damage = this.player.getUltimateDamage();
                enemy.takeDamage(damage);
                this.player.addHitTarget(enemy);

                // Add hit effect for ultimates
                if (playerAttackHitbox.isUltimate) {
                    this.createHitEffect(enemy.sprite.x, enemy.sprite.y, playerAttackHitbox.ultimateType);

                    // Apply medium attack stun and lift effect
                    if (playerAttackHitbox.ultimateType === 'medium') {
                        const mediumConfig = GameConfig.ultimates.medium;
                        enemy.applyStun(mediumConfig.stunDuration, mediumConfig.liftPower);
                    }
                }
            }
        }

        // Check enemy attacks hitting player
        const enemyAttackHitbox = enemy.getLastAttackHitbox();
        if (enemyAttackHitbox && this.player.sprite.active && !this.player.isHurt) {
            if (!enemy.hasHitTarget(this.player) && this.physics.overlap(enemyAttackHitbox, this.player.sprite)) {
                const damage = enemyAttackHitbox.attackDamage || enemyConfig.attackDamage;
                this.player.takeDamage(enemy, damage);
                enemy.addHitTarget(this.player);
            }
        }
    }
    //To Spawn Skeletons 
    spawnSkeletons(count, startX, y, spacing = 50) {
        // Initialize skeletons array if it doesn't exist IMPORTAAAAAAAANT
        if (!this.skeletons) {
            this.skeletons = [];
        }

        const newSkeletons = [];

        for (let i = 0; i < count; i++) {
            const xPosition = startX + (i * spacing);
            const skeleton = new Skeleton(this, xPosition, y);
            skeleton.speed = Math.floor(Math.random() * 21) + 80;

            // Add to skeletons array
            if (this.ground) {
                this.physics.add.collider(skeleton.sprite, this.ground);
            }
            this.skeletons.push(skeleton);
            newSkeletons.push(skeleton);
        }

        // Setup colliders for new skeletons
        newSkeletons.forEach(skeleton => {

            
        });

        return newSkeletons;
    }
    //To Spawn Boss (الشايب)
    spawnBoss(x, y) {
        // Remove existing boss
        if (this.boss) {
            this.boss.sprite.destroy();
            this.boss = null;
        }

        // Create new boss
        this.boss = new Boss(this, x, y);


        // Physics with ground
        if (this.ground) {
            this.physics.add.collider(this.boss.sprite, this.ground);
        }

        // Create boss health bar
        if (this.bossHealthBar) {
            this.bossHealthBar.destroy();
        }
        this.bossHealthBar = new BossHealthBar(this, this.boss);

        // Show boss health bar when boss is active
        if (this.boss && this.boss.sprite.active) {
            this.bossHealthBar.show();
        }

        // Add Physics between boss and existing skeletons
        if (this.skeletons) {
            this.skeletons.forEach(skeleton => {
                if (skeleton.sprite.active) {
                    this.physics.add.collider(skeleton.sprite, this.boss.sprite);
                }
            });
        }

        return this.boss;
    }

    // تنظيف المشهد الحالي للمشهد التالي تشتغل بشكل اوتماتيكي مع تغيير المشهد
    shutdown() {

        if (this.skeletons && this.skeletons.length > 0) {
            this.skeletons.forEach(skeleton => {
                if (skeleton && skeleton.sprite) {
                    skeleton.sprite.destroy();
                }
            });
            this.skeletons = [];
        }

        if (this.boss && this.boss.sprite) {
            this.boss.sprite.destroy();
            this.boss = null;
        }

        if (this.bossHealthBar) {
            this.bossHealthBar.destroy();
            this.bossHealthBar = null;
        }

        if (this.player && this.player.sprite) {
            this.player.sprite.destroy();
            this.player = null;
        }

        if (this.playerUI) {
            this.playerUI.destroy();
            this.playerUI = null;
        }

        if (this.trailSprites && this.trailSprites.length > 0) {
            this.trailSprites.forEach(trail => {
                if (trail && trail.active) {
                    trail.destroy();
                }
            });
            this.trailSprites = [];
        }

        if (this.input && this.input.keyboard) {
            this.input.keyboard.off('keycombomatch');
        }

        if (this.physics && this.physics.world) {
            this.physics.world.timeScale = 1;
        }
        this.isSlowMo = false;
    }
}
