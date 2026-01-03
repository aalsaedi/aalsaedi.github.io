class EnemyHealthBar {
    constructor(scene, enemy) {
        this.scene = scene;
        this.enemy = enemy;

        this.barConfig = {
            width: 40,
            height: 6,
            offsetY: -50, //دم العظمي فوق راسه
            radius: 3
        };


        // دم العظمي
        this.bar = this.scene.add.graphics();
        this.bar.setDepth(901);
    }

    update() {
        if (!this.enemy.sprite.active || this.enemy.health <= 0) {
            this.bar.clear();
            return;
        }

        const { width, height, offsetY, radius } = this.barConfig;
        const x = this.enemy.sprite.x - width / 2;
        const y = this.enemy.sprite.y + offsetY;

        const healthPercent = Math.max(0, this.enemy.health / GameConfig.skeleton.maxHealth);
        const barWidth = width * healthPercent;

        this.bar.clear();
        if (barWidth > 0) {
            this.bar.fillStyle(0xcc0000, 1);
            this.bar.fillRoundedRect(x + 1, y + 1, barWidth - 2, height - 2, radius - 1);
        }
    }

    destroy() {
        this.bar.destroy();
    }
}
