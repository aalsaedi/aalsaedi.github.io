class ShopScene extends Phaser.Scene {
    constructor() {
        super("ShopScene");
    }

    create() {
        const { width, height } = this.scale;
        
        
        this.totalGold = parseInt(localStorage.getItem('total_gold')) || 0;
        this.upgrades = JSON.parse(localStorage.getItem('diver_upgrades')) || {
            maxOxygen: 100,
            speedMultiplier: 1.0,
            startShield: false
        };

        this.add.graphics().fillStyle(0x001a33, 1).fillRect(0, 0, width, height);
        
        this.add.text(width / 2, 100, "DIVER SHOP", { fontSize: '64px', fill: '#00ffff', fontStyle: 'bold' }).setOrigin(0.5);
        
        this.goldDisplay = this.add.text(width / 2, 180, `TOTAL GOLD: ${this.totalGold}`, { 
            fontSize: '32px', fill: '#ffd700' 
        }).setOrigin(0.5);

        this.createUpgradeButton(width / 2, 350, "Bigger Oxygen Tank", 10000, () => {
            this.upgrades.maxOxygen += 25;
            this.saveAndRefresh();
        });

        this.createUpgradeButton(width / 2, 480, "Better Flippers (Speed)", 15000, () => {
            this.upgrades.speedMultiplier += 0.1;
            this.saveAndRefresh();
        });

        this.createUpgradeButton(width / 2, 610, "Reinforced Suit (Start Shield)", 30000, () => {
            this.upgrades.startShield = true;
            this.saveAndRefresh();
        });

        const backBtn = this.add.text(width / 2, 850, "Back to Menu", { fontSize: '32px', fill: '#ffffff' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start("MenuScene"));
    }

    createUpgradeButton(x, y, label, cost, onBuy) {
        const btnBg = this.add.rectangle(x, y, 600, 100, 0x333333).setInteractive({ useHandCursor: true });
        const txt = this.add.text(x, y, `${label}\nCost: ${cost} Gold`, { fontSize: '24px', align: 'center' }).setOrigin(0.5);

        btnBg.on('pointerover', () => btnBg.setFillStyle(0x444444));
        btnBg.on('pointerout', () => btnBg.setFillStyle(0x333333));
        
        btnBg.on('pointerdown', () => {
            if (this.totalGold >= cost) {
                this.totalGold -= cost;
                onBuy();
            } else {
                this.cameras.main.shake(200, 0.005);
                txt.setText("NOT ENOUGH GOLD!");
                this.time.delayedCall(1000, () => txt.setText(`${label}\nCost: ${cost} Gold`));
            }
        });
    }

    saveAndRefresh() {
        localStorage.setItem('total_gold', this.totalGold);
        localStorage.setItem('diver_upgrades', JSON.stringify(this.upgrades));
        this.goldDisplay.setText(`TOTAL GOLD: ${this.totalGold}`);
        this.sound.play('gold_snd', { volume: 0.5 });
    }
}

export default ShopScene;