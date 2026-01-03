
var MenuScene = {
  key: "MenuScene",

  create: function () {
    // background
    this.cameras.main.setBackgroundColor("#111111");

    // Title
    this.add.text(400, 120, "Tower Group", {
      fontSize: "48px",
      color: "#ffffff",
      fontFamily: "Arial"
    }).setOrigin(0.5);

    // Start button
    let startBtn = this.add.text(400, 240, "Start Game", {
      fontSize: "32px",
      color: "#00ff00",
      fontFamily: "Arial"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    startBtn.on("pointerdown", () => {
      
      this.scene.start("GameScene");
    });

    // Tutorial button
    let tutorialBtn = this.add.text(400, 300, "Tutorial", {
      fontSize: "28px",
      color: "#00aaff",
      fontFamily: "Arial"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    tutorialBtn.on("pointerdown", () => {
      this.scene.start("TutorialScene");
    });

    
    this.add.text(400, 380, "Click a button or press Space to start", {
      fontSize: "16px",
      color: "#cccccc",
      fontFamily: "Arial"
    }).setOrigin(0.5);

    // Allow keyboard start with SPACE
    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("GameScene");
    });
  }
};

var TutorialScene = {
  key: "TutorialScene",

  create: function () {
    this.cameras.main.setBackgroundColor("#0f0f1f");

    this.add.text(400, 80, "Tutorial", {
      fontSize: "40px",
      color: "#ffffff",
      fontFamily: "Arial"
    }).setOrigin(0.5);

    this.add.text(400, 160, "Controls:\n- Tower auto shoots\n- Reload: R\n- Open shop on wave end\n\nSurvive waves and upgrade!", {
      fontSize: "20px",
      color: "#cccccc",
      align: "center",
      fontFamily: "Arial"
    }).setOrigin(0.5);

    let backBtn = this.add.text(400, 420, "Back", {
      fontSize: "28px",
      color: "#ff4444",
      fontFamily: "Arial"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    backBtn.on("pointerdown", () => {
      this.scene.start("MenuScene");
    });
  }
};


