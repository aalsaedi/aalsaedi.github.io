// المرحلة الثانية والأخيرة
class SecondScene extends BaseGameScene {

    constructor() {
        super("SecondScene");
    }

    preload() {
        // تحميل خلفيات المرحلة (مع مفاتيح فريدة لكل مرحلة)
        this.load.image("level2_sky", "assets/backgrounds/level2/sky.png");
        this.load.image("level2_trees", "assets/backgrounds/level2/trees.png");
        this.load.image("level2_trees2", "assets/backgrounds/level2/trees2.png");
        this.load.image("level2_trees3", "assets/backgrounds/level2/trees3.png");
        this.load.image("level2_rocks", "assets/backgrounds/level2/rocks.png");
        this.load.image("level2_cloud", "assets/backgrounds/level2/cloud.png");
        this.load.image("level2_clouds", "assets/backgrounds/level2/clouds.png");

        this.load.image("level2_ground", "assets/backgrounds/level2/ground.png");

        // تحميل الموارد المورثة
        this.preloadCommonAssets();

    }

    // تفعيل موارد المرحلة
    createLevelAnimations() {
        // طبقات الخلفية
        this.sky = this.add.tileSprite(0, this.game.config.height / 2 - 50 , this.game.config.width * 3.5, 0, "level2_sky");
        this.sky.setOrigin(0.5, 0.5);
        this.sky.setDepth(-6);
        this.sky.setScrollFactor(0);

        this.clouds = this.add.tileSprite(0, this.game.config.height / 2 , this.game.config.width * 3.5, 0, "level2_clouds");
        this.clouds.setOrigin(0.5, 0.5);
        this.clouds.setDepth(-5);
        this.clouds.setScrollFactor(0);

        this.rocks = this.add.tileSprite(0, this.game.config.height / 2 , this.game.config.width * 3.5, 0, "level2_rocks");
        this.rocks.setOrigin(0.5, 0.5);
        this.rocks.setDepth(-4);
        this.rocks.setScrollFactor(0);

        this.cloud = this.add.tileSprite(0, this.game.config.height / 2.5 , this.game.config.width * 4, 0, "level2_cloud");
        this.cloud.setOrigin(0.5, 0.5);
        this.cloud.setDepth(-3);
        this.cloud.setScrollFactor(0);

        this.trees = this.add.tileSprite(0,0, this.game.config.width * 3 , 1080, "level2_trees");
        this.trees.setOrigin(0, 0);
        this.trees.setDepth(-1);
        this.trees.setScrollFactor(0);
        this.trees.setScale(0.5);

        this.trees2 = this.add.tileSprite(0,0, this.game.config.width * 3 , 1080, "level2_trees2");
        this.trees2.setOrigin(0, 0);
        this.trees2.setDepth(-2);
        this.trees2.setScrollFactor(0);
        this.trees2.setScale(0.5);

        this.trees3 = this.add.tileSprite(0,0, this.game.config.width * 3 , 1080, "level2_trees3");
        this.trees3.setOrigin(0, 0);
        this.trees3.setDepth(-3);
        this.trees3.setScrollFactor(0);
        this.trees3.setScale(0.5);

        // الأرضية
        this.ground = this.add.tileSprite(0, this.game.config.height, this.game.config.width * 10, this.game.config.height + 40, "level2_ground");
        this.ground.setDepth(1);
        this.ground.setScrollFactor(0);
        this.ground.setScale(0.2);
        this.physics.add.existing(this.ground, true);
        this.ground.body.setSize(this.game.config.width * 10, 100);
        this.ground.body.setOffset(0, 5);

    }
    
    create() {
        // حفظ اسم المرحلة الحالية
        window.GameState.currentScene = "SecondScene";

        // إيقاف skeleton-fight وتشغيل boss-fight
        if (this.sound.get('skeleton-fight')) {
            this.sound.get('skeleton-fight').stop();
        }
        if (!this.sound.get('boss-fight')) {
            this.sound.play('boss-fight', { loop: true, volume: 0.3 });
        }

        // تفعيل الدوال المتوارثة لتسهيل عميلة صنع المراحل
        this.setupControls();
        this.setupCamera(this.game.config.width * 2, this.game.config.height);
        this.createCommon();
        this.createLevelAnimations();
        this.setupPlayer(0, 0);
        this.physics.add.collider(this.player.sprite, this.ground);
        this.setupUltimates();
        this.setupSlowMotion();
        this.spawnBoss(1200,200);
        this.spawnSkeletons(5, 800, 200, 100);

        // إضافة متابعة لموت الشايب
        this.bossDefeated = false;

    }

    update(time, delta) {
        // دالة مورثة للإختصار
        this.updateBase(time, delta);

        // تحريك الخلفيات مع حركة اللاعب
        this.ground.tilePositionX = this.myCam.scrollX;
        this.sky.tilePositionX = this.myCam.scrollX * 0.05;
        this.clouds.tilePositionX = this.myCam.scrollX * 0.05;
        this.rocks.tilePositionX = this.myCam.scrollX * 0.05;
        this.cloud.tilePositionX = this.myCam.scrollX * 0.09;
        this.trees.tilePositionX = this.myCam.scrollX * 0.3;
        this.trees2.tilePositionX = this.myCam.scrollX * 0.2;
        this.trees3.tilePositionX = this.myCam.scrollX * 0.1;

        // نظام قتال العظمي
        if (this.skeletons) {
            this.skeletons.forEach(skeleton => {
                skeleton.update(this.player.sprite);
                this.handleCombat(skeleton, GameConfig.skeleton);
            });
        }

        // نظام قتال الشايب
        if (this.bossHealthBar) {
            this.bossHealthBar.update();
        }
        if (this.boss && this.boss.sprite.active) {
            this.boss.update(this.player.sprite);
            this.handleCombat(this.boss, GameConfig.boss);
        }

        // التحقق من هزيمة الشايب
        if (this.boss && !this.bossDefeated && this.boss.health <= 0) {
            this.bossDefeated = true;
            // الانتظار ثانيتين ثم عرض الكرديت
            this.time.delayedCall(2000, () => {
                this.showCredits();
            });
        }


    }

    showCredits() {
        // إيقاف ثيم boss-fight
        if (this.sound.get('boss-fight')) {
            this.sound.get('boss-fight').stop();
        }

        // إيقاف الفيزياء والتحديثات
        this.physics.pause();

        // تعطيل المدخلات من اللاعب
        if (this.controls) {
            this.controls.left.enabled = false;
            this.controls.right.enabled = false;
            this.controls.up.enabled = false;
            this.controls.attack.enabled = false;
            this.controls.ultimate.enabled = false;
        }

        // إنشاء خلفية سوداء ثابتة على الكاميرا
        const blackBackground = this.add.rectangle(
            this.myCam.scrollX + this.game.config.width / 2,
            this.game.config.height / 2,
            this.game.config.width,
            this.game.config.height,
            0x000000
        );
        blackBackground.setDepth(10000);
        blackBackground.setScrollFactor(0);

        // عرض أنيميشن الكرديت ثابت على الكاميرا
        const creditsSprite = this.add.sprite(
            this.game.config.width / 2,
            this.game.config.height / 2,
            'credits-frame-000' // الفريم الأول
        );
        creditsSprite.setDepth(10001);
        creditsSprite.setScrollFactor(0);

        // ضبط حجم الأنيميشن ليناسب الشاشة
        const scaleX = this.game.config.width / creditsSprite.width;
        const scaleY = this.game.config.height / creditsSprite.height;
        const scale = Math.max(scaleX, scaleY);
        creditsSprite.setScale(scale);

        // تشغيل الأنيميشن
        creditsSprite.play('credits-animation');

        // العودة للمنيو بعد انتهاء الأنيميشن
        creditsSprite.once('animationcomplete', () => {
            this.scene.start('MenuScene');
        });
    }
}
