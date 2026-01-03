const gameState = {
  sceneWidth: 0,
  sceneHeight: 0,
  score: 0,
  music: true,
  sound: true,
};

window.onload = function(){
    const createPlatform = (group, spriteWidth, myTexture, dist = 0) => {
        const platform = group.create(spriteWidth + dist, gameState.sceneHeight, myTexture)
          .setOrigin(0, 1)
          .setScale(0.5);
        if (myTexture === 'ground') {
          platform.setImmovable(true);
          platform.setSize(platform.displayWidth * 2, platform.displayHeight - 50);
        }
      
        switch (myTexture) {
          case 'ground':
            platform.setDepth(2);
            break;
          case 'plateau':
            platform.setDepth(1);
            break;
          default:
        }
      };

      const updatePlatform = (group, spriteWidth, myTexture, dist = 0) => {
        const child = group.get(spriteWidth - dist, gameState.sceneHeight, myTexture);
        child.setVisible(true);
        child.setActive(true);
        switch (myTexture) {
          case 'ground':
            child.setDepth(2);
            break;
          case 'plateau':
            child.setDepth(1);
            break;
          default:
        }
      };

      const moveBackgroundPlatform = (group, platformWidth, myTexture, scrollFactor) => {
        group.children.iterate((child) => {
          child.x -= scrollFactor;
          if (child.x < -(child.displayWidth)) {
            group.killAndHide(child);
            updatePlatform(group, platformWidth, myTexture, scrollFactor);
          }
        });
      };

      const playStopAudio = (status, audio) => {
        if (status) {
          if (!audio.isPlaying) {
            audio.play();
          }
        } else {
          audio.stop();
        }
      };

    class FirstScene extends Phaser.Scene{
        constructor(){
            super("FirstScene");
            this.timer = 0;
            this.secondTimer = 0;
            this.healthTimer = 0;
            this.missileScore = 0;
        }    

        
        preload(){
            this.width = this.scale.width;
            this.height = this.scale.height;
           
            this.load.image('sky', 'assets/sky.png');
            this.load.image('mountains', 'assets/mountains.png');
            this.load.image('plateau', 'assets/plateau.png');
            this.load.image('ground', 'assets/ground.png');

            this.load.spritesheet('player', 'assets/playersprite.png', { frameWidth: 250, frameHeight: 250 });
            this.load.spritesheet('bird', 'assets/birdSprite.png', { frameWidth: 290, frameHeight: 300 });

            this.load.image('coin', 'assets/coin.png');
            this.load.image('spike', 'assets/spike.png');

            // load sounds        
            this.load.audio('theme1', 'assets/theme1.ogg');
            this.load.audio('theme2', 'assets/theme2.ogg');

            this.load.audio('jumpSound', 'assets/jumpSound.mp3');
            this.load.audio('spikeSound', 'assets/spikeSound.mp3');
            this.load.audio('pickCoin', 'assets/pickCoin.wav');
            
            // Play again button
            this.load.image('playAgain', 'assets/playAgain.png');
            this.load.image('playAgainHover', 'assets/playAgainHover.png');

        }
        
        // create animations function
        createAnimations(animKey, spriteKey, startFrame, endFrame, loopTimes, frameRate) {
          return (this.anims.create({
            key: animKey,
            frames: this.anims.generateFrameNumbers(spriteKey, { start: startFrame, end: endFrame }),
            frameRate,
            repeat: loopTimes,
          }));
        }
                      
         // create game background
         addGameBackground() {
            this.add.image(gameState.sceneWidth / 2, gameState.sceneHeight / 2, 'sky').setScale(0.5);

            this.mountainGroup = this.add.group();
            this.firstMountain = this.mountainGroup.create(0, gameState.sceneHeight, 'mountains').setScale(0.5).setOrigin(0, 1);
            this.mountainWidth = this.firstMountain.displayWidth;
            createPlatform(this.mountainGroup, this.mountainWidth, 'mountains');

            this.plateauGroup = this.add.group();
            this.firstPlateau = this.plateauGroup.create(0, gameState.sceneHeight, 'plateau').setScale(0.5).setOrigin(0, 1);
            this.plateauWidth = this.firstPlateau.displayWidth;
            createPlatform(this.plateauGroup, this.plateauWidth, 'plateau');

            this.groundGroup = this.physics.add.group();
            this.first = this.groundGroup.create(0, this.scale.height, 'ground')
            .setOrigin(0, 1)
            .setScale(0.5);
            this.first.setImmovable(true);

            this.groundWidth = this.first.displayWidth;
            this.groundHeight = this.first.displayHeight;
            this.first.setSize(this.groundWidth * 2, this.groundHeight - 50);

            createPlatform(this.groundGroup, this.groundWidth, 'ground');
        }

        create(){
            gameState.sceneWidth = this.scale.width;
            gameState.sceneHeight = this.scale.height;
            
            this.gameTheme = this.sound.add('theme2', { loop: true });
            this.gameTheme.volume = 0.1;
        
            playStopAudio(gameState.music, this.gameTheme);

            this.addSoundEffects(); // Create Sound Effects

            gameState.score = 0;
            this.health = 50;
        
            this.scoreText = this.add.text(50, 25, 'Coins: ', {
              fontSize: '40px',
              fill: '#ffffff',
              fontFamily: '"Akaya Telivigala"',
              strokeThickness: 10,
              stroke: '#FFD700',
            }).setDepth(8);
            
            this.scoreValue = this.add.text(170, 25, `${gameState.score}`, {
              fontSize: '40px',
              fill: '#ffffff',
              fontFamily: '"Akaya Telivigala"',
              strokeThickness: 5,
              stroke: '#000',
            }).setDepth(8);
        
            this.healthText = this.add.text(50, 75, 'Health: ', {
              fontSize: '30px',
              fill: '#ffffff',
              strokeThickness: 8,
              fontFamily: '"Akaya Telivigala"',
              stroke: '#FF69B4',
            }).setDepth(8);

            this.addGameBackground();
            
            // Progress bar
            this.progressBox = this.add.graphics();
            this.progressBar = this.add.graphics();
            this.progressBox.setDepth(8);
            this.progressBar.setDepth(8);
        
            this.progressBox.lineStyle(3, 0x0275d8, 1);
            this.progressBox.strokeRect(170, 95, this.health, 10);
        
            this.progressBar.fillStyle(0xFFD700, 1);
            this.progressBar.fillRect(170, 95, this.health, 10);
            // End progress bar


            this.player = this.physics.add.sprite(200, gameState.sceneHeight - 300, 'player').setScale(0.2);

            this.physics.add.collider(this.player, this.groundGroup);
            this.player.setGravityY(800);
            this.player.setDepth(6);
            this.player.body.setCollideWorldBounds();
            this.player.setSize(this.player.width / 2, this.player.height - 30);
            this.player.setOffset(this.player.width / 2 - 20, 30);
        
            this.createAnimations('run', 'player', 0, 5, -1, 12);
        
            this.createAnimations('jump', 'player', 0, 0, -1, 1);
        
            this.cursors = this.input.keyboard.createCursorKeys();
            this.jumpTimes = 2;
            this.jump = 0;
        
            // Birds SECTION
        
            this.birdGroup = this.physics.add.group();
        
            const createBird = () => {
              const myY = Phaser.Math.Between(100, 300);
              const bird = this.birdGroup.create(gameState.sceneWidth + 100, myY, 'bird').setScale(0.3);
              bird.setVelocityX(-100);
              bird.flipX = true;
              bird.setDepth(6);
              bird.setSize(bird.displayWidth - 10, bird.displayHeight - 10);
            };
        
            this.createAnimations('fly', 'bird', 0, 8, -1, 7);
        
            this.birdCreationTime = this.time.addEvent({
              callback: createBird,
              delay: Phaser.Math.Between(2500, 5000),
              callbackScope: this,
              loop: true,
            });
        
            // Coins SECTION
        
            this.coinGroup = this.physics.add.group();
            const createCoin = () => {
              this.createBirdDrop(this.coinGroup, 'coin');
            };
        
            this.physics.add.collider(this.coinGroup, this.groundGroup, (singleCoin) => {
              singleCoin.setVelocityX(-200);
            });
        
            this.physics.add.overlap(this.player, this.coinGroup, (player, singleCoin) => {
              this.pickCoin.play();
              singleCoin.destroy();
              gameState.score += 1;
              this.health += 1;
              this.scoreValue.setText(`${gameState.score}`);
              this.hoveringTextScore(player, '1+', '#0000ff');
            });
        
            this.coinCreationTime = this.time.addEvent({
              callback: createCoin,
              delay: 1000,
              callbackScope: this,
              loop: true,
            });
        
        
            // Spikes SECTION
        
            this.spikeGroup = this.physics.add.group();
            function createSpike() {
              this.createBirdDrop(this.spikeGroup, 'spike');
            }
        
            this.spikeCreationTime = this.time.addEvent({
              callback: createSpike,
              delay: 5000,
              callbackScope: this,
              loop: true,
            });
        
            this.physics.add.collider(this.spikeGroup, this.groundGroup, (singleSpike) => {
              singleSpike.setVelocityX(-200);
            });
        
            this.physics.add.overlap(this.player, this.spikeGroup, (player, singleSpike) => {
              this.spikeSound.play();
              singleSpike.destroy();
              this.health -= 15;
              this.hoveringTextScore(player, 'Spiked!', '#CCCC00', '#800080');
            });
        
        
            this.leftBound = this.add.rectangle(-50, 0, 10, gameState.sceneHeight, 0x000000).setOrigin(0);
            this.bottomBound = this.add.rectangle(0, gameState.sceneHeight,
              gameState.sceneWidth, 10, 0x000000).setOrigin(0);
            this.boundGroup = this.physics.add.staticGroup();
            this.boundGroup.add(this.leftBound);
            this.boundGroup.add(this.bottomBound);
                    
            // Health bar update
            const reduceHealthTimely = () => {
                this.health -= 1;
                this.progressBar.clear();
                this.progressBar.fillStyle(0xFFD700, 1);
                this.progressBar.fillRect(170, 95, this.health, 10);
                this.healthTimer = 0;
            };
        
            this.time.addEvent({
                callback: reduceHealthTimely,
                delay: 500,
                loop: true,
                callbackScope: this,
            });            
        } // END of create function above
 
        createBirdDrop(group, texture) {
          if (this.birdGroup.getLength() >= 2) {
            const child = this.birdGroup.getChildren()[Phaser.Math.Between(0,
              this.birdGroup.getLength() - 1)];
            const drop = group.create(child.x, child.y, texture).setScale(0.05);
            if (texture === 'spike') {
              drop.setScale(0.1);
            }
            drop.setGravityY(700);
            drop.setGravityX(0);
            drop.setDepth(6);
            drop.setBounce(1);
            drop.setSize(drop.width - 200, drop.height - 200);
          }
        }

      
        hoveringTextScore(player, message, strokeColor, fillColor = '#ffffff') {
          const singleScoreText = this.add.text(player.x, player.y, message, {
            fontSize: '30px',
            fill: fillColor,
            fontFamily: '"Akaya Telivigala"',
            strokeThickness: 2,
            stroke: strokeColor,
          }).setDepth(7);
          singleScoreText.setAlpha(1);
      
          this.tweens.add({
            targets: singleScoreText,
            repeat: 0,
            duration: 1000,
            ease: 'linear',
            alpha: 0,
            y: singleScoreText.y - 100,
            onComplete() {
              singleScoreText.destroy();
            },
          });
        }

        // Sound Effect ***************
        createSoundEffect(soundKey, volumeLevel, loopStatus = false) {
          const effect = this.sound.add(soundKey, { loop: loopStatus });
          effect.volume = volumeLevel;
          return effect;
        }
      
        addSoundEffects() {
          this.pickCoin = this.createSoundEffect('pickCoin', 0.3, false);
          this.spikeSound = this.createSoundEffect('spikeSound', 0.2, false);
          this.jumpSound = this.createSoundEffect('jumpSound', 0.05, false);          
        }
        // end Sound Effect ***************
      
        update(){
            moveBackgroundPlatform(this.mountainGroup, this.mountainWidth, 'mountains', 0.5);
            moveBackgroundPlatform(this.plateauGroup, this.plateauWidth, 'plateau', 1.5);
            moveBackgroundPlatform(this.groundGroup, this.groundWidth, 'ground', 4);

             
            if (this.health <= 0) {
              this.gameTheme.stop();    // stop sound
              this.scene.stop();      // stop scene
              this.scene.start('GameOver');   // show gameover
            }

            // update player anim
            this.player.anims.play('run', true);
            this.birdGroup.children.iterate((child) => {
              child.anims.play('fly', true);
            });
            
            // Use Keyboard
            if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
              if (this.player.body.touching.down || (this.jump < this.jumpTimes && (this.jump > 0))) {
                this.player.setVelocityY(-400);
                this.jumpSound.play();

                if ((this.player.body.touching.down)) {
                  this.jump = 0;
                }
                this.jump += 1;
              }
            }    

            // slow down charater
            if (this.cursors.down.isDown) {
              if (!this.player.body.touching.down) {
                this.player.setGravityY(1300);
              }
            }
        }
    }
    
    var config = {
        width: 960,
        height: 520,
        backgroundColor: 0xebdd04,
        physics: {
            default: 'arcade',
            arcade: {
              gravity: { y: 0 },
            },
          },
        scene: [FirstScene, GameOver],
    }
    
	var game = new Phaser.Game(config);
}
