// شاشة الموت
class DeathScene extends Phaser.Scene {
    constructor() {
        super("DeathScene");
    }

    create() {
        // إضافة خلفية "fallen"
        const background = this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'fallen');
        background.setOrigin(0.5);

        // شريط جانبي اللون من الاسود إلى الشفاف
        const sidebarWidth = 400;

        // الشريط الأيمن - أزرق من شفاف إلى أزرق
        if (!this.textures.exists('gradient-rightbar')) {
            const rightCanvas = this.textures.createCanvas('gradient-rightbar', sidebarWidth, this.game.config.height);
            const rightContext = rightCanvas.getContext();

            const rightGradient = rightContext.createLinearGradient(0, 0, sidebarWidth, 0);
            rightGradient.addColorStop(0, 'rgba(0, 128, 233, 0)'); // شفاف من الوسط
            rightGradient.addColorStop(1, 'rgba(0, 128, 233, 1)'); // أزرق في اليمين

            rightContext.fillStyle = rightGradient;
            rightContext.fillRect(0, 0, sidebarWidth, this.game.config.height);
            rightCanvas.refresh();
        }

        // الشريط الأيسر - أحمر من أحمر إلى شفاف
        if (!this.textures.exists('gradient-leftbar')) {
            const leftCanvas = this.textures.createCanvas('gradient-leftbar', sidebarWidth, this.game.config.height);
            const leftContext = leftCanvas.getContext();

            const leftGradient = leftContext.createLinearGradient(0, 0, sidebarWidth, 0);
            leftGradient.addColorStop(0, 'rgba(194, 15, 15, 1)'); // أحمر في اليسار
            leftGradient.addColorStop(1, 'rgba(194, 15, 15, 0)'); // شفاف عند الوسط

            leftContext.fillStyle = leftGradient;
            leftContext.fillRect(0, 0, sidebarWidth, this.game.config.height);
            leftCanvas.refresh();
        }

        // إضافة الشريط الأيمن
        const rightSidebar = this.add.image(this.game.config.width - sidebarWidth, 0, 'gradient-rightbar');
        rightSidebar.setOrigin(0, 0);

        // إضافة الشريط الأيسر
        const leftSidebar = this.add.image(0, 0, 'gradient-leftbar');
        leftSidebar.setOrigin(0, 0);
        

        // نص "لقد سقطت"
        const deathText = this.add.text(
            this.game.config.width / 2,
            400,
            'لقد سقطت',
            {
                fontSize: '72px',
                fill: '#c20f0fff',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }
        );
        deathText.setOrigin(0.5);

        // تأثير وميض للنص
        this.tweens.add({
            targets: deathText,
            alpha: 0.3,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // زر إعادة المحاولة من هذه المرحلة
        const retryButton = this.add.image(
            this.game.config.width - sidebarWidth / 2,
            400,
            'retry'
        );

        retryButton.setOrigin(0.5);
        retryButton.setScale(0.3);
        retryButton.setInteractive({ useHandCursor: true });

        retryButton.on('pointerup', () => {
            // إعادة تشغيل المشهد
            this.scene.start(window.GameState.currentScene);
        });

        // زر العودة للقائمة الرئيسية (البداية من جديد)
        const menuButton = this.add.image(
            sidebarWidth / 2,
            400,
            'giveup'
        );
        menuButton.setOrigin(0.5);
        menuButton.setScale(0.3);
        menuButton.setInteractive({ useHandCursor: true });

        menuButton.on('pointerup', () => {
            // إعادة تعيين كل شيء
            window.location.reload();
        });
    }
}
