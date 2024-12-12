class Scene extends Phaser.Scene {
  constructor() {
      super("Scene");
  }

  preload() {
      this.load.image("desert", "assets/desert.png");
      this.load.image("clean", "assets/clean.png");
      this.load.image("dirty", "assets/dirty.png");
      this.load.spritesheet("fox", "assets/fox.png", {
          frameWidth: 128,
          frameHeight: 128
      });

      this.load.audio("dirtySound", "assets/dirty.wav");
      this.load.audio("cleanSound", "assets/clean.wav");

      this.load.audio("gameoverSound", "assets/gameover.wav");
  }

  create() {
      
      var desert = this.add.image(0, 0, 'desert').setOrigin(0, 0);
      desert.setDisplaySize(config.width, config.height);
      
      this.dirtyWaterSound = this.sound.add("dirtySound");
      this.cleanWaterSound = this.sound.add("cleanSound");
      this.gameOverSound = this.sound.add("gameoverSound");
      
      // -----------------Water--------------------------- 
      this.cleanDrops = this.physics.add.group();
      this.dirtyDrops = this.physics.add.group();

      var maxCleanObjects = 3; //num of CLEAN water drop
      var maxDirtyObjects = 3; //num of DIRTY water drop

      // func to prevent overlaping in water drop 
      const createNonOverlappingDrop = (group, texture) => {
        var drop;
        var isOverlapping = true;

        while (isOverlapping) {
            isOverlapping = false;
            drop = this.physics.add.sprite(
                Phaser.Math.Between(0, config.width),
                Phaser.Math.Between(-100, 0),
                texture
            );

            drop.setScale(0.1); //size of the drop water
            drop.speed = Phaser.Math.Between(2, 5);

            group.children.iterate((existingDrop) => {
                if (Phaser.Math.Distance.Between(
                    existingDrop.x, existingDrop.y,
                    drop.x, drop.y) < 60
                ) {
                    isOverlapping = true;
                }
            });
        }

        return drop;
    };
      // Create water drops
      for (var i = 0; i < maxCleanObjects; i++) {
          var cleanDrop = createNonOverlappingDrop(this.cleanDrops, "clean");
          this.cleanDrops.add(cleanDrop);
      }

      for (var i = 0; i < maxDirtyObjects; i++) {
          var dirtyDrop = createNonOverlappingDrop(this.dirtyDrops, "dirty");
          this.dirtyDrops.add(dirtyDrop);
      }


      //-------------------- Fox---------------------- 
      this.player = this.physics.add.sprite(config.width / 2, 570, "fox");
      this.player.setScale(1.5);
       //-------------------- Fox Animation ----------------------
       this.anims.create({
        key: "run",
        frames: this.anims.generateFrameNumbers("fox", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
    });
    this.player.play("run");

    // Add cursor keys for movement
    this.cursors = this.input.keyboard.createCursorKeys();
    this.speed = 5;

    // Initialize dirty drops counter
    this.dirtyDropCount = 5; // Starts with 5 dirty drops
    this.dirtyCountText = this.add.text(16, 16, ' Health: ' + this.dirtyDropCount, {
        fontSize: '32px',  
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2
    });
}
 //------------------- moveObject-----------------------
  moveObject(obj, speed) {
    obj.x += speed;
    if (obj.x > config.width) {
        obj.x = 0;
    } else if (obj.x < 0) {
        obj.x = config.width;
    }
}
//------------------ check for dirty and clean drops collision ---------------------
checkForDropCollision() {
    // Check for dirty drops collision
    this.physics.overlap(this.player, this.dirtyDrops, (player, drop) => {
        if (this.dirtyDropCount > 0) {
            this.dirtyDropCount--; // Decrease dirty drop count
            drop.y = Phaser.Math.Between(-50, 0); // Reset the drop's position
            drop.x = Phaser.Math.Between(0, config.width); // Reset its horizontal position
            this.dirtyCountText.setText(' Health: ' + this.dirtyDropCount);

            this.dirtyWaterSound.play();
        }
        
        if (this.dirtyDropCount <= 0) {
           
            this.gameOver(); // End the game if 5 dirty drops are collected
        }
    });

    // Check for clean drops collision
    this.physics.overlap(this.player, this.cleanDrops, (player, drop) => {
        drop.y = Phaser.Math.Between(-50, 0); // Reset position
        drop.x = Phaser.Math.Between(0, config.width); // Reset horizontal position
        this.cleanWaterSound.play();
    });
}

//------------------- game over function -------------------
gameOver() {
    this.gameOverSound.play();
    
    this.time.delayedCall(100, () => { //delay the game pause to play the game over sound
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.add.text(config.width / 2, config.height / 2 - 50, "Game Over", {
        fontSize: "32px",
        fill: "#ff0000",
    }).setOrigin(0.5);

    // Replay button
    let replayButton = this.add.text(config.width / 2, config.height / 2 + 50, "Replay", {
        fontSize: "28px",
        fill: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 10, y: 5 },
        borderRadius: 7,
    }).setOrigin(0.5)
      .setInteractive();
      
    // Restart the scene when the replay button is clicked
    replayButton.on("pointerdown", () => {
        this.scene.restart();
    });

})}

  update() {
      // Update water drops
      this.cleanDrops.children.iterate((drop) => {
          drop.y += drop.speed;
          if (drop.y > config.height) {
              drop.y = Phaser.Math.Between(-50, 0);
              drop.x = Phaser.Math.Between(0, config.width);
          }
      });

      this.dirtyDrops.children.iterate((drop) => {
          drop.y += drop.speed;
          if (drop.y > config.height) {
              drop.y = Phaser.Math.Between(-50, 0);
              drop.x = Phaser.Math.Between(0, config.width);
          }
      });
      if (this.cursors.left.isDown) {
        this.moveObject(this.player, -this.speed); // Move left
        this.player.flipX = true;
    }
    if (this.cursors.right.isDown) {
        this.moveObject(this.player, this.speed); // Move right
        this.player.flipX= false;
    }
    
    this.checkForDropCollision();  
    
}
}