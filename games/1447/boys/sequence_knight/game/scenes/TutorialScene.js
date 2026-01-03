// مرحلة التعليم
class TutorialScene extends BaseGameScene {

    constructor() {
        super("TutorialScene");

        // متغيرات التعليم
        this.tutorialStep = 0;
        this.tutorialCompleted = {
            movement: false,
            jump: false,
            attack: false,
            defend: false,
            slowMo: false,
            lightCombo: false,
            mediumCombo: false,
            heavyCombo: false
        };
        this.tutorialTexts = [];
        this.keyImages = [];
        this.comboKeyImages = [];
        this.tutorialContainer = null;
        this.movementTimer = 0;
        this.attackCount = 0;
        this.defendTimer = 0;
        this.slowMoTimer = 0;
        this.canProceed = false;
    }

    preload() {
        // تحميل خلفيات المرحلة
        this.load.image("level0_sky", "assets/backgrounds/level0/sky.png");
        this.load.image("level0_pines", "assets/backgrounds/level0/pines.png");
        this.load.image("level0_rocks3", "assets/backgrounds/level0/rocks_3.png");
        this.load.image("level0_rocks2", "assets/backgrounds/level0/rocks_2.png");
        this.load.image("level0_rocks", "assets/backgrounds/level0/rocks_1.png");
        this.load.image("level0_clouds3", "assets/backgrounds/level0/clouds_3.png");
        this.load.image("level0_clouds2", "assets/backgrounds/level0/clouds_2.png");
        this.load.image("level0_clouds", "assets/backgrounds/level0/clouds_1.png");

        this.load.image("level0_ground", "assets/backgrounds/level0/ground.png");

        // تحميل صور الكبيورد
        this.load.image("key_w", "assets/backgrounds/keys/w.png");
        this.load.image("key_a", "assets/backgrounds/keys/a.png");
        this.load.image("key_s", "assets/backgrounds/keys/s.png");
        this.load.image("key_d", "assets/backgrounds/keys/d.png");
        this.load.image("key_f", "assets/backgrounds/keys/f.png");
        this.load.image("key_q", "assets/backgrounds/keys/q.png");
        this.load.image("key_shift", "assets/backgrounds/keys/shift.png");
        this.load.image("key_up", "assets/backgrounds/keys/up.png");
        this.load.image("key_down", "assets/backgrounds/keys/down.png");
        this.load.image("key_left", "assets/backgrounds/keys/left.png");
        this.load.image("key_right", "assets/backgrounds/keys/right.png");

        // تحميل الموارد المورثة
        this.preloadCommonAssets();
    }

    // تفعيل موارد المرحلة
    createLevelAnimations() {
        // طبقات الخلفية
        this.sky = this.add.tileSprite(0, this.game.config.height / 2 - 50 , this.game.config.width * 3.5, 0, "level0_sky");
        this.sky.setOrigin(0.5, 0.5);
        this.sky.setDepth(-6);
        this.sky.setScrollFactor(0);

        this.clouds3 = this.add.tileSprite(0, this.game.config.height / 2 , this.game.config.width * 3.5, 0, "level0_clouds3");
        this.clouds3.setOrigin(0.5, 0.5);
        this.clouds3.setDepth(-5);
        this.clouds3.setScrollFactor(0);

        this.clouds2 = this.add.tileSprite(0, this.game.config.height / 2 , this.game.config.width * 3.5, 0, "level0_clouds2");
        this.clouds2.setOrigin(0.5, 0.5);
        this.clouds2.setDepth(-4);
        this.clouds2.setScrollFactor(0);

        this.clouds = this.add.tileSprite(0, this.game.config.height / 2 , this.game.config.width * 3.5, 0, "level0_clouds");
        this.clouds.setOrigin(0.5, 0.5);
        this.clouds.setDepth(-3);
        this.clouds.setScrollFactor(0);

        this.cloud = this.add.tileSprite(0, this.game.config.height / 2.5 , this.game.config.width * 4, 0, "level0_clouds");
        this.cloud.setOrigin(0.5, 0.5);
        this.cloud.setDepth(-3);
        this.cloud.setScrollFactor(0);

        this.rocks = this.add.tileSprite(0,0, this.game.config.width * 3 , 1080, "level0_rocks");
        this.rocks.setOrigin(0, 0);
        this.rocks.setDepth(-1);
        this.rocks.setScrollFactor(0);
        this.rocks.setScale(0.5);

        this.rocks2 = this.add.tileSprite(0,0, this.game.config.width * 3 , 1080, "level0_rocks2");
        this.rocks2.setOrigin(0, 0);
        this.rocks2.setDepth(-2);
        this.rocks2.setScrollFactor(0);
        this.rocks2.setScale(0.5);

        this.rocks3 = this.add.tileSprite(0,0, this.game.config.width * 3 , 1080, "level0_rocks3");
        this.rocks3.setOrigin(0, 0);
        this.rocks3.setDepth(-3);
        this.rocks3.setScrollFactor(0);
        this.rocks3.setScale(0.5);


        // الأرضية
        this.ground = this.add.tileSprite(0, this.game.config.height, this.game.config.width * 10, this.game.config.height + 40, "level0_ground");
        this.ground.setDepth(1);
        this.ground.setScrollFactor(0);
        this.ground.setScale(0.2);
        this.physics.add.existing(this.ground, true);
        this.ground.body.setSize(this.game.config.width * 10, 100);
        this.ground.body.setOffset(0, 5);

    }

    create() {
        // حفظ اسم المرحلة الحالية
        window.GameState.currentScene = "TutorialScene";

        // تفعيل الدوال المتوارثة لتسهيل عميلة صنع المراحل
        this.setupControls();
        this.setupCamera(this.game.config.width, this.game.config.height);
        this.createCommon();
        this.createLevelAnimations();
        this.setupPlayer(200, 0);
        this.physics.add.collider(this.player.sprite, this.ground);
        this.setupUltimates();
        this.setupSlowMotion();

        // بدء التعليم
        this.createTutorialUI();
        this.showTutorialStep(0);
    }

    // واجهة التعليم
    createTutorialUI() {
        // مربع التعليمات
        this.tutorialContainer = this.add.container(0, 0);
        this.tutorialContainer.setScrollFactor(0);
        this.tutorialContainer.setDepth(1000);

        // خلفية شبه شفافة للنص
        this.tutorialBg = this.add.rectangle(
            this.game.config.width / 2,
            120,
            this.game.config.width / 2,
            200,
            0x000000,
            0.4
        );
        this.tutorialBg.setStrokeStyle(3, 0xffffff);

        // النص الرئيسي
        this.tutorialText = this.add.text(
            this.game.config.width / 2,
            60,
            '',
            {
                fontFamily: 'Arial',
                fontSize: '28px',
                color: '#ffffff',
                align: 'center',
                rtl: true,
                wordWrap: { width: this.game.config.width - 150 }
            }
        ).setOrigin(0.5, 0);

        // النص الفرعي
        this.tutorialSubText = this.add.text(
            this.game.config.width / 2,
            110,
            '',
            {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: '#ffff00',
                align: 'center',
                rtl: true,
                wordWrap: { width: this.game.config.width - 150 }
            }
        ).setOrigin(0.5, 0);

        // علامة الإكمال
        this.completionText = this.add.text(
            this.game.config.width / 2,
            140,
            '',
            {
                fontFamily: 'Arial',
                fontSize: '24px',
                color: '#00ff00',
                align: 'center',
                rtl: true
            }
        ).setOrigin(0.5, 0);

        this.tutorialContainer.add([this.tutorialBg, this.tutorialText, this.tutorialSubText, this.completionText]);
    }

    // عرض خطوة التعليم
    showTutorialStep(step) {
        // حذف الصور القديمة
        this.keyImages.forEach(img => img.destroy());
        this.keyImages = [];
        this.comboKeyImages.forEach(img => img.destroy());
        this.comboKeyImages = [];

        const centerX = this.game.config.width / 2;
        const keyY = 190;
        

        switch(step) {
            case 0:
                this.tutorialText.setText('مرحبًا بك في Sequence Knight');
                this.tutorialSubText.setText('يجب عليك أن تتعلم جميع الحركات للتقدم');
                this.completionText.setText('');

                this.time.delayedCall(3000, () => {
                    this.tutorialStep = 1;
                    this.showTutorialStep(1);
                });
                break;

            case 1:
                // الحركة
                this.tutorialText.setText('الحركة');
                this.tutorialSubText.setText('A للحركة لليسار  |  D للحركة لليمين');
                this.completionText.setText('');

                // عرض مفاتيح الحركة
                const keyA = this.add.image(centerX - 60, keyY, 'key_a').setScale(0.5).setScrollFactor(0).setDepth(1001);
                const keyD = this.add.image(centerX + 60, keyY, 'key_d').setScale(0.5).setScrollFactor(0).setDepth(1001);
                this.keyImages.push(keyA, keyD);
                break;

            case 2:
                // القفز
                this.tutorialText.setText('القفز');
                this.tutorialSubText.setText('W للقفز  |  S الهبوط السريع');
                this.completionText.setText('');

                const keyW = this.add.image(centerX - 60, keyY, 'key_w').setScale(0.5).setScrollFactor(0).setDepth(1001);
                const keyS = this.add.image(centerX + 60, keyY, 'key_s').setScale(0.5).setScrollFactor(0).setDepth(1001);
                this.keyImages.push(keyW, keyS);
                break;

            case 3:
                // الهجوم
                this.tutorialText.setText('الهجوم - انتبه يستهلك نشاط');
                this.tutorialSubText.setText('F للهجوم - علق على الزر تهجم اسرع');
                this.completionText.setText('');

                const keyF = this.add.image(centerX, keyY, 'key_f').setScale(0.5).setScrollFactor(0).setDepth(1001);
                this.keyImages.push(keyF);
                break;

            case 4:
                // الدفاع
                this.tutorialText.setText('الصد');
                this.tutorialSubText.setText('Shift للصد - يقلل الضرر بنسبة 90%');
                this.completionText.setText('');

                const keyShift = this.add.image(centerX, keyY, 'key_shift').setScale(0.5).setScrollFactor(0).setDepth(1001);
                this.keyImages.push(keyShift);
                break;

            case 5:
                // السلو موشن
                this.tutorialText.setText('توقف الزمن');
                this.tutorialSubText.setText('Q لتفعيل ميزة توقف الزمن - يزيد سرعتك ويبطئ العدو');
                this.completionText.setText('النشاط لا يتجدد أثناء توقف الزمن!');

                const keyQ = this.add.image(centerX, keyY, 'key_q').setScale(0.5).setScrollFactor(0).setDepth(1001);
                this.keyImages.push(keyQ);
                break;

            case 6:
                // تسلسل الضوء (Light)
                this.tutorialText.setText('تسلسل الإنتقال الفوري - انتبه يستهلك نشاط');
                this.tutorialSubText.setText('اضغط Q ثم: ↑ ↑ ↓ ↓');
                this.completionText.setText('أسرع تسلسل - ضرر 50');

                const spacing = 60;
                const startX = centerX - (spacing * 1.5);

                var q = this.add.image(startX + spacing * 4, keyY, 'key_q').setScale(0.4).setScrollFactor(0).setDepth(1001);
                const l1 = this.add.image(startX, keyY, 'key_down').setScale(0.4).setScrollFactor(0).setDepth(1001);
                const l2 = this.add.image(startX + spacing, keyY, 'key_down').setScale(0.4).setScrollFactor(0).setDepth(1001);
                const l3 = this.add.image(startX + spacing * 2, keyY, 'key_up').setScale(0.4).setScrollFactor(0).setDepth(1001);
                const l4 = this.add.image(startX + spacing * 3, keyY, 'key_up').setScale(0.4).setScrollFactor(0).setDepth(1001);
                this.comboKeyImages.push(l4, l3, l2, l1,q);
                break;

            case 7:
                // تسلسل المتوسط (Medium)
                this.tutorialText.setText('تسلسل الجو - انتبه يستهلك نشاط');
                this.tutorialSubText.setText('اضغط Q ثم: ↓ ↓ ↑ ↑');
                this.completionText.setText('يرفع العدو - ضرر 75');

                const spacing2 = 60;
                const startX2 = centerX - (spacing2 * 1.5);
                var q = this.add.image(startX2 + spacing2 * 4, keyY, 'key_q').setScale(0.4).setScrollFactor(0).setDepth(1001);
                const m1 = this.add.image(startX2, keyY, 'key_up').setScale(0.4).setScrollFactor(0).setDepth(1001);
                const m2 = this.add.image(startX2 + spacing2, keyY, 'key_up').setScale(0.4).setScrollFactor(0).setDepth(1001);
                const m3 = this.add.image(startX2 + spacing2 * 2, keyY, 'key_down').setScale(0.4).setScrollFactor(0).setDepth(1001);
                const m4 = this.add.image(startX2 + spacing2 * 3, keyY, 'key_down').setScale(0.4).setScrollFactor(0).setDepth(1001);
                this.comboKeyImages.push(m4, m3, m2, m1,q);
                break;

            case 8:
                // تسلسل الثقيل (Heavy)
                this.tutorialText.setText('تسلسل الثقيل - انتبه يستهلك نشاط');
                this.tutorialSubText.setText('اضغط Q ثم: ← → ← →');
                this.completionText.setText('أقوى تسلسل للجهتين - ضرر 100');

                const spacing3 = 60;
                const startX3 = centerX - (spacing3 * 1.5);
                var q = this.add.image(startX3 + spacing3 * 4, keyY, 'key_q').setScale(0.4).setScrollFactor(0).setDepth(1001);
                const h1 = this.add.image(startX3, keyY, 'key_right').setScale(0.4).setScrollFactor(0).setDepth(1001);
                const h2 = this.add.image(startX3 + spacing3, keyY, 'key_left').setScale(0.4).setScrollFactor(0).setDepth(1001);
                const h3 = this.add.image(startX3 + spacing3 * 2, keyY, 'key_right').setScale(0.4).setScrollFactor(0).setDepth(1001);
                const h4 = this.add.image(startX3 + spacing3 * 3, keyY, 'key_left').setScale(0.4).setScrollFactor(0).setDepth(1001);
                this.comboKeyImages.push(h4, h3, h2, h1,q);
                break;

            case 9:
                // النهاية
                this.tutorialText.setText('!فنااان');
                this.tutorialSubText.setText('خلصت التعليم يا وحش');
                this.completionText.setText('→ روح يمين علشان المرحلة الأولى');
                break;
        }
    }

    update(time, delta) {
        // دالة مورثة للإختصار
        this.updateBase(time, delta);

        this.ground.tilePositionX = this.myCam.scrollX;
        this.clouds.tilePositionX = this.myCam.scrollX * 0.4;
        this.sky.tilePositionX = this.myCam.scrollX * 0.05;
        this.clouds3.tilePositionX = this.myCam.scrollX * 0.05;
        this.rocks.tilePositionX = this.myCam.scrollX * 0.05;
        this.clouds2.tilePositionX = this.myCam.scrollX * 0.06;
        this.rocks.tilePositionX = this.myCam.scrollX * 0.3;
        this.rocks2.tilePositionX = this.myCam.scrollX * 0.2;
        this.rocks3.tilePositionX = this.myCam.scrollX * 0.1;

        // تتبع تقدم التعليم
        this.checkTutorialProgress(delta);

        // الانتقال للمرحلة التالية بعد إكمال التعليم - يتطلب إتمام جميع المهام
        if (this.canProceed && this.player.sprite.x >= this.physics.world.bounds.width - 20 && this.keys.d.isDown && this.tutorialStep === 9) {
            this.scene.start('FirstScene');
        }
    }

    // تتبع تقدم التعليم
    checkTutorialProgress(delta) {
        switch(this.tutorialStep) {
            case 1: // الحركة
                if ((this.keys.a.isDown || this.keys.d.isDown) && this.player.isMoving) {
                    this.movementTimer += delta;
                    if (this.movementTimer >= 2000 && !this.tutorialCompleted.movement) {
                        this.tutorialCompleted.movement = true;
                        this.completionText.setText('✓ مبروك! تعلمت كيف تتحرك');
                        this.time.delayedCall(1500, () => {
                            this.tutorialStep = 2;
                            this.showTutorialStep(2);
                        });
                    }
                }
                break;

            case 2: // القفز
                if (this.keys.w.isDown && !this.player.sprite.body.blocked.down && !this.tutorialCompleted.jump) {
                    this.tutorialCompleted.jump = true;
                    this.completionText.setText('!✓ مبدع! فووووووق');
                    this.time.delayedCall(1500, () => {
                        this.tutorialStep = 3;
                        this.showTutorialStep(3);
                    });
                }
                break;

            case 3: // الهجوم
                if (this.player.isAttacking && !this.tutorialCompleted.attack) {
                    this.attackCount++;
                    if (this.attackCount >= 3) {
                        this.tutorialCompleted.attack = true;
                        this.completionText.setText('✓ خطير! تعلمت الهجوم ');
                        this.time.delayedCall(1500, () => {
                            this.tutorialStep = 4;
                            this.showTutorialStep(4);
                            this.attackCount = 0;
                        });
                    }
                }
                break;

            case 4: // الدفاع
                if (this.keys.shift.isDown && this.player.isDefending && !this.tutorialCompleted.defend) {
                    this.defendTimer += delta;
                    if (this.defendTimer >= 2000) {
                        this.tutorialCompleted.defend = true;
                        this.completionText.setText('!✓ ممتاز! تعلمت الصد');
                        this.time.delayedCall(1500, () => {
                            this.tutorialStep = 5;
                            this.showTutorialStep(5);
                        });
                    }
                }
                break;

            case 5: // توقف الزمن
                if (this.isSlowMo && !this.tutorialCompleted.slowMo) {
                    this.slowMoTimer += delta;
                    if (this.slowMoTimer >= 2000) {
                        this.tutorialCompleted.slowMo = true;
                        this.completionText.setText('✓ حركات! توقف الزمن بيفك لك أزمة!');
                        this.time.delayedCall(1500, () => {
                            this.tutorialStep = 6;
                            this.showTutorialStep(6);
                        });
                    }
                }
                break;

            case 6: // تسلسل الانتقال الفوري
                if (this.player.isUltimateActive && this.player.currentUltimateType === 'light' && !this.tutorialCompleted.lightCombo) {
                    this.tutorialCompleted.lightCombo = true;
                    this.completionText.setText('!✓ بطل! أتقنت تسلسل الضوء');
                    this.time.delayedCall(1500, () => {
                        this.tutorialStep = 7;
                        this.showTutorialStep(7);
                    });
                }
                break;

            case 7: // تسلسل الجو
                if (this.player.isUltimateActive && this.player.currentUltimateType === 'medium' && !this.tutorialCompleted.mediumCombo) {
                    this.tutorialCompleted.mediumCombo = true;
                    this.completionText.setText('!✓ رهيب! أتقنت تسلسل المتوسط');
                    this.time.delayedCall(1500, () => {
                        this.tutorialStep = 8;
                        this.showTutorialStep(8);
                    });
                }
                break;

            case 8: // تسلسل الثقيل
                if (this.player.isUltimateActive && this.player.currentUltimateType === 'heavy' && !this.tutorialCompleted.heavyCombo) {
                    this.tutorialCompleted.heavyCombo = true;
                    this.canProceed = true;
                    this.completionText.setText('!✓ خرافي! أتقنت أقوى تسلسل');
                    this.time.delayedCall(1500, () => {
                        this.tutorialStep = 9;
                        this.showTutorialStep(9);
                    });
                }
                break;
        }
    }
}
