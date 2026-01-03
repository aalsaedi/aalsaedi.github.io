class BossHealthBar {
    constructor(scene, boss) {
        this.scene = scene;
        this.boss = boss;
        this.isVisible = false;

        this.createBossHealthBar();
    }

    //دم الشايب
    createBossHealthBar() {
        const cam = this.scene.cameras.main;
        const gameWidth = cam.width;
        const barWidth = Math.min(600, gameWidth - 200);

        this.bossBarConfig = {
            width: barWidth,
            height: 30,
            x: 330,
            y: 50,
            radius: 15
        };

        const { width, height, x, y, radius } = this.bossBarConfig;

        // اسم الشايب
        this.bossNameText = this.scene.add.text(cam.scrollX + gameWidth, y - 25, 'الشايب', {
            fontSize: '32px',
            fill: '#ff0000',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        this.bossNameText.setOrigin(0.5, 0.5);
        this.bossNameText.setScrollFactor(0);
        this.bossNameText.setDepth(1003);
        this.bossNameText.setVisible(false);



        // خلفية دم الشايب
        this.bossBarBg = this.scene.add.graphics();
        this.bossBarBg.setScrollFactor(0);
        this.bossBarBg.setDepth(1000);
        this.drawBossBarBackground();

        this.bossBar = this.scene.add.graphics();
        this.bossBar.setScrollFactor(0);
        this.bossBar.setDepth(1001);
    }

    drawBossBarBackground() {
        const { width, height, x, y, radius } = this.bossBarConfig;

        this.bossBarBg.clear();

        this.bossBarBg.fillStyle(0x000000, 1);
        this.bossBarBg.fillRoundedRect(x, y, width, height, radius);

        this.bossBarBg.lineStyle(3, 0xffffff, 1);
        this.bossBarBg.strokeRoundedRect(x, y, width, height, radius);
    }

    show() {
        this.isVisible = true;
        this.bossNameText.setVisible(true);
        this.bossBarBg.setVisible(true);
    }

    hide() {
        this.isVisible = false;
        this.bossNameText.setVisible(false);
        this.bossBarBg.setVisible(false);
        this.bossBar.clear();
    }

    //تحديث دم الشايب 
    update() {
        if (!this.isVisible || !this.boss || !this.boss.sprite.active) {
            return;
        }

        const { width, height, x, y, radius } = this.bossBarConfig;
        const padding = 4;
        const healthPercent = Math.max(0, this.boss.health / GameConfig.boss.maxHealth);
        const barWidth = (width - padding * 2) * healthPercent;

        this.bossBar.clear();

        if (barWidth > 0) {
            this.bossBar.fillStyle(0xf80000, 1);
            this.bossBar.fillRoundedRect(x + padding, y + padding, barWidth, height - padding * 2, radius - 3);
        }
    }

    destroy() {
        if (this.bossNameText) this.bossNameText.destroy();
        if (this.bossBarBg) this.bossBarBg.destroy();
        if (this.bossBar) this.bossBar.destroy();
    }
}
