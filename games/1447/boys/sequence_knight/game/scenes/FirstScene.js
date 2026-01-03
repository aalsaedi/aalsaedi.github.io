// المرحلة الأولى
class FirstScene extends BaseGameScene {

    constructor() {
        super("FirstScene");
    }

    preload() {
        // تحميل خلفيات المرحلة (مع مفاتيح فريدة لكل مرحلة)
        this.load.image("level1_sky", "assets/backgrounds/level1/sky.png");
        this.load.image("level1_trees", "assets/backgrounds/level1/trees.png");
        this.load.image("level1_rocks", "assets/backgrounds/level1/rocks.png");
        this.load.image("level1_clouds", "assets/backgrounds/level1/clouds_1.png");
        this.load.image("level1_clouds2", "assets/backgrounds/level1/clouds_2.png");

        this.load.image("level1_ground", "assets/backgrounds/level1/ground.png");
        // تحميل الموارد المورثة
        this.preloadCommonAssets();
    }

    // تفعيل موارد المرحلة
    createLevelAnimations() {
        // طبقات الخلفية
        this.sky = this.add.tileSprite(0, this.game.config.height / 2 - 50 , this.game.config.width * 3.5, 0, "level1_sky");
        this.sky.setOrigin(0.5, 0.5);
        this.sky.setDepth(-6);
        this.sky.setScrollFactor(0);

        this.clouds2 = this.add.tileSprite(0, this.game.config.height / 3 , this.game.config.width * 3.5, 0, "level1_clouds2");
        this.clouds2.setOrigin(0.5, 0.5);
        this.clouds2.setDepth(-4);
        this.clouds2.setScrollFactor(0);

        this.clouds = this.add.tileSprite(0, this.game.config.height / 2 , this.game.config.width * 3.5, 0, "level1_clouds");
        this.clouds.setOrigin(0.5, 0.5);
        this.clouds.setDepth(-3);
        this.clouds.setScrollFactor(0);

        this.rocks = this.add.tileSprite(0, this.game.config.height / 1.5 , this.game.config.width * 3 , 0, "level1_rocks");
        this.rocks.setScale(0.7);
        this.rocks.setOrigin(0, 0.5);
        this.rocks.setDepth(-2);
        this.rocks.setScrollFactor(0);

        this.trees = this.add.tileSprite(0, this.game.config.height / 1 , this.game.config.width * 2  , 0, "level1_trees");
        this.trees.setScale(0.5);
        this.trees.setOrigin(0,1);
        this.trees.setDepth(-1);
        this.trees.setScrollFactor(0);


        // الأرضية
        this.ground = this.add.tileSprite(0, this.game.config.height, this.game.config.width * 10, this.game.config.height + 40, "level1_ground");
        this.ground.setDepth(1);
        this.ground.setScrollFactor(0);
        this.ground.setScale(0.2);
        this.physics.add.existing(this.ground, true);
        this.ground.body.setSize(this.game.config.width * 10, 100);
        this.ground.body.setOffset(0, 5);



    }

    create() {
        // حفظ اسم المرحلة الحالية
        window.GameState.currentScene = "FirstScene";

        if (this.sound.get('main-theme')) {
            this.sound.get('main-theme').stop();
        }
        if (!this.sound.get('skeleton-fight')) {
            this.sound.play('skeleton-fight', { loop: true, volume: 0.3 });
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

        // إعداد نظام الموجات
        this.currentWave = 0;
        this.totalWaves = 3;
        this.waveCompleted = false;
        this.allWavesCompleted = false;

        // إنشاء نص عداد الموجات
        this.createWaveText();

        // بدء الموجة الأولى
        this.startNextWave();

    }

    // إنشاء نص عداد الموجات
    createWaveText() {
        this.waveText = this.add.text(
            this.myCam.width / 2,
            30,
            '',
            {
                fontFamily: 'Arial',
                fontSize: '36px',
                color: '#ffff00',
                stroke: '#000000',
                strokeThickness: 2,
                align: 'center',
                rtl: true
            }
        );
        this.waveText.setOrigin(0.5, 0);
        this.waveText.setScrollFactor(0);
        this.waveText.setDepth(100);
    }

    // تحديث نص عداد الموجات
    updateWaveText() {
        if (this.waveText && !this.waveCompleted) {
            
            this.waveText.setText(`الموجة ${this.currentWave} من ${this.totalWaves}`);
        }
        
    }

    // بدء الموجة التالية
    startNextWave() {
        this.currentWave++;
        this.waveCompleted = false;

        // تحديث نص الموجة
        this.updateWaveText();

        if (this.currentWave === 1) {
            // الموجة الأولى: 3 هياكل عظمية
            this.spawnSkeletons(3, 400, 200, 100);
        } else if (this.currentWave === 2) {
            // الموجة الثانية: 5 هياكل عظمية
            this.spawnSkeletons(5, 500, 200, 80);
        } else if (this.currentWave === 3) {
            // الموجة الثالثة: 7 هياكل عظمية
            this.spawnSkeletons(7, 600, 200, 70);
        }
    }

    // التحقق من اكتمال الموجة الحالية
    checkWaveCompletion() {
        if (this.waveCompleted && this.allWavesCompleted) {
            this.waveText.setText("فنان ! الآن روح يمين  !");
            return;
        }

        if (this.waveCompleted) {
            return;
        }

        // تصفية الهياكل العظمية الحية فقط
        const activeSkeletons = this.skeletons.filter(skeleton => (skeleton.health > 0));

        if (activeSkeletons.length === 0 && this.skeletons.length > 0) {
            this.waveCompleted = true;

            if (this.currentWave < this.totalWaves) {
                //  المومجة الي بعدها بعد تأخير بسيط
                this.time.delayedCall(2000, () => {
                    this.startNextWave();
                });
            } else {
                this.allWavesCompleted = true;
            }
        }
    }

    update(time, delta) {
        // دالة مورثة للإختصار
        this.updateBase(time, delta);

        this.ground.tilePositionX = this.myCam.scrollX;
        this.trees.tilePositionX = this.myCam.scrollX * 0.5;
        this.clouds.tilePositionX = this.myCam.scrollX * 0.1;
        this.sky.tilePositionX = this.myCam.scrollX * 0.05;
        this.rocks.tilePositionX = this.myCam.scrollX * 0.08;
        this.clouds2.tilePositionX = this.myCam.scrollX * 0.07;

        // السماح بالانتقال للمرحلة التالية فقط بعد إكمال جميع الموجات
        if((this.player.sprite.x >= this.physics.world.bounds.width - 20) && this.keys.d.isDown && this.allWavesCompleted) {
            // إيقاف ثيم skeleton-fight قبل الانتقال
            if (this.sound.get('skeleton-fight')) {
                this.sound.get('skeleton-fight').stop();
            }
            this.scene.start('SecondScene');
        }

        // نظام قتال العظمي
        if (this.skeletons) {
            this.skeletons.forEach(skeleton => {
                skeleton.update(this.player.sprite);
                this.handleCombat(skeleton, GameConfig.skeleton);
            });
        }

        // التحقق من اكتمال الموجة الحالية
        this.checkWaveCompletion();

    }
}
