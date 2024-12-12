class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('background', 'assets/country-platform-preview.png');
        this.load.image('bomb', 'assets/44853_bomb_explosive_icon.png');
        this.load.image('coin', 'assets/653278_coin_bitcoin_cash_currency_dollar_icon.png');
        this.load.spritesheet('character', 'assets/Run.png', {
            frameWidth: 129,
            frameHeight: 125,
        });
    }

    create() {
        this.add.image(400, 300, 'background').setOrigin(0.5, 0.5).setScale(2.7);
        

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('character', { start: 0, end: 7 }),
            frameRate: 9,
            repeat: -1,
        });

        const player = this.physics.add.sprite(400, 390, 'character');
        player.setCollideWorldBounds(true);
        player.setScale(2);
        player.setFrame(5);
        
        player.body.setSize(player.width * 0.2, player.height * 0.2, true);

        const cursors = this.input.keyboard.createCursorKeys();
        this.cursors = cursors;
        this.player = player;

        this.coins = this.physics.add.group(); 
        this.coinCount = 0; 
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

        this.scoreText = this.add.text(700, 20, 'Coins: 0', {
          fontSize: '24px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 10, y: 5 },
      }).setOrigin(1, 0);

      this.bombs = this.physics.add.group(); 
      this.physics.add.overlap(this.player, this.bombs, this.hitBomb, null, this);




        
    }

    spawnCoin() {
      
      const x = Phaser.Math.Between(50, 750); 
  
      
      const coin = this.coins.create(x, 0, 'coin'); 
  
      
      coin.setVelocityY(Phaser.Math.Between(100, 200)); 
      coin.setScale(0.3); 
      
    coin.body.setSize(coin.width, coin.height, true);

  }
  spawnBomb() {
    console.log('Spawning a bomb'); 
    const x = Phaser.Math.Between(50, 750);
    const bomb = this.bombs.create(x, 0, 'bomb');
    bomb.setVelocityY(Phaser.Math.Between(150, 250)); 
    bomb.setScale(0.7); 
    bomb.body.setSize(bomb.width, bomb.height, true); 
    console.log('Bomb created at X:', x); 

}


  collectCoin(player, coin) {
    coin.destroy(); 

    
    this.coinCount += 1;

    
    this.scoreText.setText('Coins: ' + this.coinCount);

    
    if (this.coinCount >= 100) {
        this.endGame(); 
    }
}


endGame() {
  if (this.coinTimer) {
      this.coinTimer.remove(); 
  }
  if (this.bombTimer) {
    this.bombTimer.remove(); 

  this.physics.pause(); 
  this.player.setTint(0x00ff00); 
  this.player.anims.stop();

  this.coins.clear(true, true);
  this.bombs.clear(true, true);


  
  this.add.text(400, 300, 'Congratulations! You collected 100 coins!', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 10 },
  }).setOrigin(0.5);

  
  

}

}
hitBomb(player, bomb) {
  this.physics.pause(); 
  this.player.setTint(0xff0000); 
  this.player.anims.stop(); 

  
  this.add.text(400, 300, 'Game Over!', {
      fontSize: '48px',
      color: '#ffffff',
      backgroundColor: '#ff0000',
      padding: { x: 20, y: 10 },
  }).setOrigin(0.5);

  
  if (this.coinTimer) {
      this.coinTimer.remove();
  }
  if (this.bombTimer) {
      this.bombTimer.remove();
  }
  this.coins.clear(true, true); 
  this.bombs.clear(true, true); 


}




  

update() {
  const speed = 200;
  this.player.setVelocity(0);

  if (this.cursors.left.isDown || this.cursors.right.isDown) {
      const direction = this.cursors.left.isDown ? -speed : speed;
      this.player.setVelocityX(direction);
      this.player.play('run', true);
      this.player.setFlipX(this.cursors.left.isDown);

      if (!this.isMoving) {
          this.isMoving = true;

          
          if (!this.coinTimer) {
              this.coinTimer = this.time.addEvent({
                  delay: 500,
                  callback: this.spawnCoin,
                  callbackScope: this,
                  loop: true,
              });
          }

          
          if (!this.bombTimer) {
              this.bombTimer = this.time.addEvent({
                  delay: 800,
                  callback: this.spawnBomb,
                  callbackScope: this,
                  loop: true,
              });
          }
      }
  } else {
      this.player.stop();
      this.player.setFrame(5);
  }
}


}
