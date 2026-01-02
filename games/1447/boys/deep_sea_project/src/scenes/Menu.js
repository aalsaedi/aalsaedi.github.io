class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }

    create() {
        const { width, height } = this.scale;
        
        
        const totalGold = localStorage.getItem('total_gold') || 0;
        const hasSave = localStorage.getItem('diver_save_data') !== null;

       
        this.add.graphics().fillStyle(0x004080, 1).fillRect(0, 0, width, height);

       
        const spawnBubble = () => {
            let x = Phaser.Math.Between(50, width - 50);
            
          
            let bubble = this.physics.add.sprite(x, height + 50, 'bubble_sheet', 0);
            
            
            let randomScale = Phaser.Math.FloatBetween(0.2, 0.6);
            bubble.setScale(randomScale);
            bubble.setAlpha(Phaser.Math.FloatBetween(0.3, 0.6));
            
            
            bubble.setVelocityY(Phaser.Math.Between(-70, -130));

            
            this.tweens.add({
                targets: bubble,
                x: bubble.x + Phaser.Math.Between(-20, 20),
                duration: 2000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
           
            this.time.delayedCall(12000, () => { 
                if (bubble.active) bubble.destroy(); 
            });
        };
        
        this.time.addEvent({ delay: 700, callback: spawnBubble, loop: true });
        

        this.add.text(width / 2, 200, "DEEP SEA DIVER", { fontSize: '80px', fill: '#00ffff', fontStyle: 'bold' }).setOrigin(0.5);
        this.add.text(width - 50, 50, `GOLD: ${totalGold}`, { fontSize: '24px', fill: '#ffd700' }).setOrigin(1, 0);

        const centerX = width / 2;
        
        // NEW GAME
        this.createMenuButton(centerX, height * 0.45, 'NEW GAME', () => {
            localStorage.removeItem('diver_save_data'); 
            this.scene.start("PlayScene", { isContinuing: false });
        });

        // CONTINUE
        const contBtn = this.createMenuButton(centerX, height * 0.55, 'CONTINUE', () => {
            this.scene.start("PlayScene", { isContinuing: true });
        });

        if (!hasSave) {
            contBtn.setAlpha(0.3);
            contBtn.disableInteractive(); 
            contBtn.setColor('#666666');
        }

        this.createMenuButton(centerX, height * 0.65, 'SHOP', () => this.scene.start("ShopScene"));
        this.createMenuButton(centerX, height * 0.75, 'CREDITS', () => console.log("Credits"));
    }

    createMenuButton(x, y, text, callback) {
        let btn = this.add.text(x, y, text, { 
            fontSize: '48px', 
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => {
            if (btn.input.enabled) btn.setScale(1.1).setColor('#00ffff');
        });
        btn.on('pointerout', () => {
            if (btn.input.enabled) btn.setScale(1.0).setColor('#ffffff');
        });
        btn.on('pointerdown', callback);
        return btn;
    }
}

export default MenuScene;