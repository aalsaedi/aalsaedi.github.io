class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
        this.totalFrames = 192;
        this.loopEndFrame = 130;
        this.isTransitioning = false;
        this.creditsFrameCount = 360; // عدد فريمات أنيميشن الكرديت
    }

    preload() {
        // تحميل ثيم الخلفية
        this.load.audio('main-theme', 'assets/audio/main_theme.mp3');

        // تحميل ثيم المعارك
        this.load.audio('skeleton-fight', 'assets/audio/skeleton-fight.mp3');
        this.load.audio('boss-fight', 'assets/audio/boss-fight.mp3');

        // تحميل الخلفية
        for (let i = 1; i <= this.totalFrames; i++) {
            this.load.image(`menu-frame-${i}`, `assets/backgrounds/menu-frames/${i}.jpg`);
        }

        // تحميل اللوقو والازرار الخاصة بالمنيو
        this.load.image('logo', 'assets/backgrounds/menu-images/logo-noglow.png');
        this.load.image('start-normal', 'assets/backgrounds/menu-images/start-normal.png');
        this.load.image('start-hover', 'assets/backgrounds/menu-images/start-hover.png');
        this.load.image('start-press', 'assets/backgrounds/menu-images/start-press.png');
        this.load.image('credits-normal', 'assets/backgrounds/menu-images/credits-normal.png');
        this.load.image('credits-hover', 'assets/backgrounds/menu-images/credits-hover.png');
        this.load.image('fallen', 'assets/backgrounds/menu-images/fallen.png');
        this.load.image('giveup', 'assets/backgrounds/menu-images/giveup.png');
        this.load.image('retry', 'assets/backgrounds/menu-images/retry.png');

        // تحميل فريمات أنيميشن الكرديت
        for (let i = 0; i < this.creditsFrameCount; i++) {
            const frameNum = String(i).padStart(3, '0');
            this.load.image(`credits-frame-${frameNum}`, `assets/backgrounds/credits/credits-frame-${frameNum}.jpg`);
        }
    }

    create() {
        // إعادة تعيين حالة الانتقال
        this.isTransitioning = false;

        // إيقاف أي ثيم قتال قد يكون يعمل
        if (this.sound.get('skeleton-fight')) {
            this.sound.get('skeleton-fight').stop();
        }
        if (this.sound.get('boss-fight')) {
            this.sound.get('boss-fight').stop();
        }

        // تشغيل main-theme إذا لم تكن تعمل
        if (!this.sound.get('main-theme') || !this.sound.get('main-theme').isPlaying) {
            this.sound.play('main-theme', { loop: true, volume: 0.3 });
        }

        // الخلفية المتحركة
        this.backgroundSprite = this.add.sprite(
            this.game.config.width / 2,
            this.game.config.height / 2,
            'menu-frame-1'
        );

        // تكبير الخلفية لتغطية الشاشة
        const scaleX = this.game.config.width / this.backgroundSprite.width;
        const scaleY = this.game.config.height / this.backgroundSprite.height;
        const scale = Math.max(scaleX, scaleY);
        this.backgroundSprite.setScale(scale);

        // إنشاء أنيميشن الخلفية (تكرار الفريمات من 1 إلى 130)
        const forwardFrames = Array.from({ length: this.loopEndFrame }, (_, i) => ({
            key: `menu-frame-${i + 1}`
        }));
        const reverseFrames = Array.from({ length: this.loopEndFrame - 2 }, (_, i) => ({
            key: `menu-frame-${this.loopEndFrame - i - 1}`
        }));

        // إنشاء الإنيميشن فقط إذا لم تكن موجودة
        if (!this.anims.exists('menu-idle')) {
            this.anims.create({
                key: 'menu-idle',
                frames: [...forwardFrames, ...reverseFrames],
                frameRate: 30,
                repeat: -1
            });
        }

        // إنشاء أنيميشن البدء (إطارات من 131 إلى 192)
        if (!this.anims.exists('menu-transition')) {
            this.anims.create({
                key: 'menu-transition',
                frames: Array.from({ length: this.totalFrames - this.loopEndFrame }, (_, i) => ({
                    key: `menu-frame-${this.loopEndFrame + i + 1}`
                })),
                frameRate: 30,
                repeat: 0
            });
        }

        // تشغيل أنيميشن
        this.backgroundSprite.play('menu-idle');

        // إنشاء أنيميشن الكرديت (مرة واحدة فقط)
        if (!this.anims.exists('credits-animation')) {
            const creditsFrames = [];
            for (let i = 0; i < this.creditsFrameCount; i++) {
                const frameNum = String(i).padStart(3, '0');
                creditsFrames.push({ key: `credits-frame-${frameNum}` });
            }
            this.anims.create({
                key: 'credits-animation',
                frames: creditsFrames,
                frameRate: 30, // 30 فريم في الثانية
                repeat: 0 // بدون تكرار
            });
        }

        // شريط جانبي اللون من الاسود إلى الشفاف
        const sidebarWidth = 350;

        let canvas;
        if (!this.textures.exists('gradient-sidebar')) {
            canvas = this.textures.createCanvas('gradient-sidebar', sidebarWidth, this.game.config.height);
        } else {
            canvas = this.textures.get('gradient-sidebar');
        }
        const context = canvas.getContext();

        const gradient = context.createLinearGradient(0, 0, sidebarWidth, 0);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

        context.fillStyle = gradient;
        context.fillRect(0, 0, sidebarWidth, this.game.config.height);

        canvas.refresh();

        const sidebar = this.add.image(this.game.config.width - sidebarWidth, 0, 'gradient-sidebar');
        sidebar.setOrigin(0, 0);

        // اللوقو
        const logo = this.add.image(
            this.game.config.width - sidebarWidth / 2,
            100,
            'logo'
        );
        logo.setOrigin(0.5);
        logo.setScale(0.5);

        // إنشاء زر البدء
        const startButton = this.add.image(
            this.game.config.width - sidebarWidth / 2,
            300,
            'start-hover'
        );
        startButton.setOrigin(0.5);
        startButton.setScale(1);
        startButton.setInteractive({ useHandCursor: true });

        // الماوس على زر البدء
        startButton.on('pointerover', () => {
            startButton.setTexture('start-press');
        });

        startButton.on('pointerout', () => {
            startButton.setTexture('start-hover');
        });

        startButton.on('pointerup', () => {
            startButton.setTexture('start-hover');
            this.startGame(startButton, sidebar, logo, creditsButton);
        });

        // إنشاء زر الكرديت
        const creditsButton = this.add.image(
            this.game.config.width - sidebarWidth / 2,
            450,
            'credits-normal'
        );
        creditsButton.setOrigin(0.5);
        creditsButton.setScale(0.8);
        creditsButton.setInteractive({ useHandCursor: true });

        // الماوس على زر الكرديت
        creditsButton.on('pointerover', () => {
            creditsButton.setTexture('credits-hover');
        });

        creditsButton.on('pointerout', () => {
            creditsButton.setTexture('credits-normal');
        });


        creditsButton.on('pointerup', () => {
            creditsButton.setTexture('credits-hover');
            this.opencredits();
        });
    }

    startGame(startButton, sidebar, logo, creditsButton) {
        if (!this.isTransitioning) {
            this.isTransitioning = true;

            this.backgroundSprite.stop();

            // الحصول على رقم الإطار الحالي
            const currentFrame = this.backgroundSprite.anims.currentFrame;
            const currentFrameKey = currentFrame ? currentFrame.textureKey : 'menu-frame-1';
            const currentFrameNum = parseInt(currentFrameKey.split('-')[2]);

            // إنشاء قائمة الإطارات للانتقال
            let framesToPlay = [];
            if (currentFrameNum < this.loopEndFrame) {
                for (let i = currentFrameNum; i <= this.loopEndFrame; i++) {
                    framesToPlay.push({ key: `menu-frame-${i}` });
                }
            }

            for (let i = this.loopEndFrame + 1; i <= this.totalFrames; i++) {
                framesToPlay.push({ key: `menu-frame-${i}` });
            }

            // إنشاء وتشغيل أنيميشن الانتقال
            if (!this.anims.exists('menu-transition-full')) {
                this.anims.create({
                    key: 'menu-transition-full',
                    frames: framesToPlay,
                    frameRate: 30,
                    repeat: 0
                });
            }
            this.backgroundSprite.play('menu-transition-full');

            // إخفاء عناصر المنيو
            sidebar.setVisible(false);
            startButton.setVisible(false);
            logo.setVisible(false);
            creditsButton.setVisible(false);

            // بدء المرحلة بعد انتهاء الأنيميشن
            this.backgroundSprite.once('animationcomplete', () => {
                
                this.scene.start('TutorialScene');
            });
        }
    }

    opencredits() {
        // عرض أنيميشن الكرديت
        this.showCredits();
    }

    showCredits() {
        // إخفاء خلفية المنيو والعناصر
        if (this.backgroundSprite) {
            this.backgroundSprite.setVisible(false);
        }

        // إنشاء خلفية سوداء
        const blackBackground = this.add.rectangle(
            this.game.config.width / 2,
            this.game.config.height / 2,
            this.game.config.width,
            this.game.config.height,
            0x000000
        );
        blackBackground.setDepth(1000);

        // عرض أنيميشن الكرديت
        const creditsSprite = this.add.sprite(
            this.game.config.width / 2,
            this.game.config.height / 2,
            'credits-frame-000' // الفريم الأول
        );
        creditsSprite.setDepth(1001);

        // ضبط حجم الأنيميشن ليناسب الشاشة
        const scaleX = this.game.config.width / creditsSprite.width;
        const scaleY = this.game.config.height / creditsSprite.height;
        const scale = Math.max(scaleX, scaleY);
        creditsSprite.setScale(scale);

        // تشغيل الأنيميشن
        creditsSprite.play('credits-animation');

        // العودة للمنيو بعد انتهاء الأنيميشن
        creditsSprite.once('animationcomplete', () => {
            creditsSprite.destroy();
            blackBackground.destroy();

            if (this.backgroundSprite) {
                this.backgroundSprite.setVisible(true);
            }
        });

        // السماح بإغلاق الكرديت عند الضغط على أي مكان
        let clickHandler;
        clickHandler = () => {
            creditsSprite.off('animationcomplete'); // إلغاء المستمع التلقائي
            creditsSprite.destroy();
            blackBackground.destroy();

            if (this.backgroundSprite) {
                this.backgroundSprite.setVisible(true);
            }
        };
        this.input.once('pointerdown', clickHandler);
    }
}
