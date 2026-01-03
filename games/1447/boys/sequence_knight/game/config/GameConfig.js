const GameConfig = {
    // إعدادات اللاعب
    player: {
        speed: 500,
        jumpPower: -1000,
        downSpeed: 800,
        hitboxSize: { width: 25, height: 65 },
        hitboxOffsetRight: { x: 50, y: 64 },
        hitboxOffsetLeft: { x: 53, y: 64 },
        attackDamage: 25,
        attackHitboxSize: { width: 70, height: 90 },
        attackHitboxOffsetX: 20,
        attackHitboxOffsetY: 30,
        attackHitboxDuration: 10,
        maxHealth: 100,
        maxStamina: 80,
        defendAmount:0.1, //90% نقص في الضرر من الوحوش
        staminaRegenRate: 5,
        staminaCosts: {
            attack: 10,
            jump: 0,
            defend: 10
        },
        scale: 1.5,
        animations: {
            idle: 'anim_idle',
            walk: 'anim_walk',
            run: 'anim_run',
            jump: 'anim_jump',
            attack1: 'anim_attack1',
            attack2: 'anim_attack2',
            attack3: 'anim_attack3',
            defend: 'anim_defend',
            protect: 'anim_protect',
            hurt: 'anim_hurt',
            dead: 'anim_dead',
            runAttack: 'anim_run_attack'
        },
        screenShake: { intensity: 0.01, duration: 100 },
        audioVol:0.2
    },

    // إعدادات العظمي
    skeleton: {
        speed: 100,
        hitboxSize: { width: 15, height: 33 },
        hitboxOffsetRight: { x: 26, y: 15 },
        hitboxOffsetLeft: { x: 26, y: 15 },
        detectionRange: 800,
        attackRange: 50,
        attackDelay: 300,
        attackDamage: 10,
        attackHitboxSize: { width: 50, height: 80 },
        attackHitboxOffsetX: 15,
        attackHitboxOffsetY: 5,
        attackHitboxDuration: 300,
        maxHealth: 100,
        scale: 2.5,
        animations: {
            idle: 'anim_skel_idle',
            walk: 'anim_skel_walk',
            attack: 'anim_skel_attack',
            hurt: 'anim_skel_hurt',
            dead: 'anim_skel_dead'
        },
        audioVol:0.1
    },

    // إعدادات الشايب
    boss: {
        speed: 120,
        dashDistance: 200,
        dashIdle: 1000,
        hitboxSize: { width: 20, height: 40 },
        hitboxOffsetRight: { x: 70, y: 35 },
        hitboxOffsetLeft: { x: 80, y: 35 },

        // مدى الهجوم للشايب
        tauntRange: 600,
        rangedRange: 450,
        spinRange: 250,
        closeRange: 150,

        // إعدادات الهجوم
        closeAttackDamage: 15,
        closeAttackHitboxSize: { width: 150, height: 50 },
        closeAttackHitboxOffsetX: 40,
        closeAttackHitboxOffsetY: 20,
        closeAttackDuration: 400,
        closeAttackDelay: 200,
        closeAttackDamageHammer: 20,
        closeAttackHitboxSizeHammer: { width: 80, height: 70 },
        closeAttackHitboxOffsetXHammer: 40,
        closeAttackHitboxOffsetYHammer: 50,
        closeAttackDamageSwing: 5,
        closeAttackHitboxSizeSwing: { width: 100, height: 100 },
        closeAttackHitboxOffsetXSwing: 40,
        closeAttackHitboxOffsetYSwing: -20,
        closeAttackDurationSwing: 200,

        spinAttackDamage: 20,
        spinAttackHitboxSize: { width: 200, height: 100 },
        spinAttackHitboxOffsetX: 50,
        spinAttackHitboxOffsetY: 20,
        spinAttackDuration: 900,
        spinAttackDelay: 100,

        tauntDuration: 1000,
        attackCooldown: 1500,
        maxHealth: 2000,
        scale: 3,

        animations: {
            idle: 'anim_boss_idle',
            walk: 'anim_boss_walk',
            closeAttack: 'anim_boss_attack',
            spinAttack: 'anim_boss_spin',
            rangedAttack: 'anim_boss_leap',
            taunt: 'anim_boss_taunt',
            dash: 'anim_boss_dash',
            hurt: 'anim_boss_hurt',
            dead: 'anim_boss_dead'
        },

        audioVol: 0.2
    },

    // إعدادات الحركة البطيئة
    slowMotion: {
        timeFactor: 10,
        duration: 3000,
        speedBoost: 5,
        jumpBoost: 1.25,
        trailDelay: 180,
        trailAlpha: 0.5,
        trailTint: 0x00ffff,
        trailFadeDuration: 500
    },

    // إعدادات التسلسلات (Ultimates)
    ultimates: {
        light: {
            damage: 60,
            staminaCost: 10,
            hitboxSize: { width: 600, height: 120 },
            hitboxOffsetX: 300,
            hitboxOffsetY: 30,
            hitboxDuration: 200,
            cooldown: 200,
            trailColor: 0xffff00,  // الاصفر
            trailAlpha: 0.7,
            screenShake: { intensity: 0.01, duration: 200 },
            animationKey: 'anim_attack1'
        },
        medium: {
            damage: 75,
            staminaCost: 15,
            hitboxSize: { width: 180, height: 150 },
            hitboxOffsetX: 40,
            hitboxOffsetY: 35,
            hitboxDuration: 300,
            liftPower: -2000,
            stunDuration: 1500,
            cooldown: 500,
            trailColor: 0xff6600,  // البرتقالي
            trailAlpha: 0.8,
            screenShake: { intensity: 0.015, duration: 300 },
            animationKey: 'anim_attack2'
        },
        heavy: {
            damage: 100,
            staminaCost: 20,
            hitboxSize: { width: 600, height: 180 },
            hitboxOffsetX: 200,
            hitboxOffsetY: 40,
            hitboxDuration: 400,
            cooldown: 500,
            trailColor: 0xff0000,  // الأحمر
            trailAlpha: 0.9,
            screenShake: { intensity: 0.025, duration: 500 },
            animationKey: 'anim_attack3'
        }
    }
};
