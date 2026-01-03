class PlayerUI {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;

        this.createHealthBar();
        this.createStaminaBar();
    }

    //دم اللاعب
    createHealthBar() {
        const baseWidth = 200;
        const healthRatio = GameConfig.player.maxHealth / Math.max(GameConfig.player.maxHealth, GameConfig.player.maxStamina);

        this.healthBarConfig = {
            width: baseWidth * healthRatio,
            height: 15,
            x: 20,
            y: 30,
            radius: 8
        };

        const { width, height, x, y, radius } = this.healthBarConfig;

        // كتابة كلمة الصحة للاعب
        this.healthLabel = this.scene.add.text(120, y + height / 2 - 20, 'الصحة', {
            fontSize: '16px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        });
        this.healthLabel.setOrigin(0.5, 0.5);
        this.healthLabel.setScrollFactor(0);
        this.healthLabel.setDepth(1003);

        this.healthText = this.scene.add.text(x + width + 10, y + height / 2, '100/100', {
            fontSize: '14px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.healthText.setOrigin(0, 0.5);
        this.healthText.setScrollFactor(0);
        this.healthText.setDepth(1003);

        // خلفية دم اللاعب
        this.healthBarBg = this.scene.add.graphics();
        this.healthBarBg.fillStyle(0x1a1a2e, 0.8);
        this.healthBarBg.fillRoundedRect(x, y, width, height, radius);
        this.healthBarBg.lineStyle(2, 0x333344, 1);
        this.healthBarBg.strokeRoundedRect(x, y, width, height, radius);
        this.healthBarBg.setScrollFactor(0);
        this.healthBarBg.setDepth(1000);

        this.healthBar = this.scene.add.graphics();
        this.healthBar.setScrollFactor(0);
        this.healthBar.setDepth(1001);

    }

    //نشاط اللاعب 
    createStaminaBar() {
        const baseWidth = 200;
        const staminaRatio = GameConfig.player.maxStamina / Math.max(GameConfig.player.maxHealth, GameConfig.player.maxStamina);

        this.staminaBarConfig = {
            width: baseWidth * staminaRatio,
            height: 15,
            x: 40,
            y: 70,
            radius: 8
        };

        const { width, height, x, y, radius } = this.staminaBarConfig;

        // نص النشاط
        this.staminaLabel = this.scene.add.text(120, y + height / 2 - 20, 'النشاط', {
            fontSize: '16px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        });
        this.staminaLabel.setOrigin(0.5, 0.5);
        this.staminaLabel.setScrollFactor(0);
        this.staminaLabel.setDepth(1003);

        this.staminaText = this.scene.add.text(x + width + 10, y + height / 2, '100/100', {
            fontSize: '14px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.staminaText.setOrigin(0, 0.5);
        this.staminaText.setScrollFactor(0);
        this.staminaText.setDepth(1003);

        // خلفية النشاط
        this.staminaBarBg = this.scene.add.graphics();
        this.staminaBarBg.fillStyle(0x1a1a2e, 0.8);
        this.staminaBarBg.fillRoundedRect(x, y, width, height, radius);
        this.staminaBarBg.lineStyle(2, 0x333344, 1);
        this.staminaBarBg.strokeRoundedRect(x, y, width, height, radius);
        this.staminaBarBg.setScrollFactor(0);
        this.staminaBarBg.setDepth(1000);

        this.staminaBar = this.scene.add.graphics();
        this.staminaBar.setScrollFactor(0);
        this.staminaBar.setDepth(1001);

    }

    update() {
        this.updateHealthBar();
        this.updateStaminaBar();
    }

    //تحديث الدم
    updateHealthBar() {
        const { width, height, x, y, radius } = this.healthBarConfig;
        const padding = 3;
        const currentHealth = Math.max(0, this.player.health);
        const maxHealth = GameConfig.player.maxHealth;
        const healthPercent = Math.max(0, currentHealth / maxHealth);
        const barWidth = (width - padding * 2) * healthPercent;

        this.healthBar.clear();

        if (barWidth > 0) {
            this.healthBar.fillStyle(0x43cc27, 1);
            this.healthBar.fillRoundedRect(x + padding, y + padding, barWidth, height - padding * 2, radius - 2);
        }

        this.healthText.setText(`${Math.round(currentHealth)}/${maxHealth}`);
    }

    //تحديث النشاط
    updateStaminaBar() {
        const { width, height, x, y, radius } = this.staminaBarConfig;
        const padding = 3;
        const currentStamina = Math.max(0, this.player.stamina);
        const maxStamina = GameConfig.player.maxStamina;
        const staminaPercent = Math.max(0, currentStamina / maxStamina);
        const barWidth = (width - padding * 2) * staminaPercent;

        this.staminaBar.clear();

        if (barWidth > 0) {
            this.staminaBar.fillStyle(0xffff00, 1);
            this.staminaBar.fillRoundedRect(x + padding, y + padding, barWidth, height - padding * 2, radius - 2);
        }

        this.staminaText.setText(`${Math.round(currentStamina)}/${maxStamina}`);
    }
}
