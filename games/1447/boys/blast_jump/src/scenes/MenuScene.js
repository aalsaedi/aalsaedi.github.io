export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    const { width, height } = this.scale;

    // ✅ BACKGROUND IMAGE
    this.add
      .image(0, 0, "menuBG")
      .setOrigin(0, 0)
      .setDisplaySize(width, height) // cover screen
      .setDepth(-100);

    // (Optional) dark overlay to make text clearer
    this.add.rectangle(0, 0, width, height, 0x000000, 0.35).setOrigin(0, 0);

    // Game title
    this.add.text(width / 2, height / 3, "BLAST JUMP", {
      fontSize: "48px",
      color: "#ffffff",
      fontStyle: "bold",
    }).setOrigin(0.5);

    // PLAY BUTTON
    const playButton = this.add.text(width / 2, height / 2, "PLAY", {
      fontSize: "32px",
      backgroundColor: "#2ecc71",
      color: "#ffffff",
      padding: { x: 25, y: 12 },
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    playButton.on("pointerdown", () => {
      this.scene.start("GameScene");
    });

    // EXIT BUTTON
    const exitButton = this.add.text(width / 2, height / 2 + 80, "EXIT", {
      fontSize: "32px",
      backgroundColor: "#e74c3c",
      color: "#ffffff",
      padding: { x: 25, y: 12 },
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    exitButton.on("pointerdown", () => {
      this.add.text(width / 2, height - 40, "Close the tab to exit", {
        fontSize: "16px",
        color: "#ffffff",
      }).setOrigin(0.5);
    });

    // ✅ Hover effect (nice)
    [playButton, exitButton].forEach((btn) => {
      btn.on("pointerover", () => btn.setScale(1.08));
      btn.on("pointerout", () => btn.setScale(1));
    });
  }
}
