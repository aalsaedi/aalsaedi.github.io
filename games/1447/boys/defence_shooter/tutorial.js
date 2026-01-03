class TutorialScene extends Phaser.Scene {
    constructor() {
        super("TutorialScene");
    }

    preload() {}

    create() {
        this.add.text(400, 80, "How to Play", {
            fontSize: "40px",
            color: "#ffffff"
        }).setOrigin(0.5);

        this.add.text(400, 200, 
`🟡 OBJECTIVE
Survive incoming waves of enemies.

🟠 CONTROLS
• The tower auto-shoots enemies.
• Press R when ammo = 0 to reload.
• Sometimes a FAST RELOAD QTE appears.
  → Press R quickly inside the timer circle.

🟣 AFTER EACH WAVE
Choose:
• Continue
• Open Shop to Upgrade

🟥 TOWER DAMAGE
If an enemy reaches the tower → you lose HP.

💰 Gold is rewarded per kill.`, 
        {
            fontSize: "20px",
            color: "#dddddd",
            align: "left"
        }).setOrigin(0.5);

        this.add.text(400, 520, "Press SPACE to Return to Menu", {
            fontSize: "22px",
            color: "#00ff00"
        }).setOrigin(0.5);

        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.start("MenuScene");
        });
    }

    update() {}
}
