class PlayGame extends Phaser.Scene {
  constructor() { super("playGame"); }

  create() {
    this.speedX = 3; 
    this.onGround = true; 
    this.gameOver = false; 
    this.started = false;

    // الخلفية
    this.bg = this.add.tileSprite(300, 200, 600, 400, "bg").setDepth(-2);

    // الأرضيات
    this.groundBottom = this.add.tileSprite(300, 368, 600, 32, "ground").setOrigin(0.5,0);
    this.groundTop = this.add.tileSprite(300, 0, 600, 32, "ground").setOrigin(0.5,0);
    this.groundTop.setFlipY(true); // الأرضية العليا مقلوبة

    // اللاعب
    this.player = this.physics.add.sprite(100, 368, "player").setCollideWorldBounds(true);
    this.player.body.setAllowGravity(false);

    // تحريك اللاعب
    this.anims.create({ key: "walkDown", frames: this.anims.generateFrameNumbers("player",{ start:0,end:3 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: "walkUp", frames: this.anims.generateFrameNumbers("player",{ start:4,end:7 }), frameRate: 8, repeat: -1 });
    this.player.play("walkDown");

    // العقبات
    this.obstacles = this.physics.add.group();
    this.physics.add.overlap(this.player, this.obstacles, this.endGame, null, this);

    // السكور
    this.score = 0;
    this.scoreDiv = document.getElementById("score-text");
    this.scoreDiv.innerText = "Score: 0";

    // التحكم
    this.input.keyboard.on("keydown-SPACE", ()=>{ if(this.started&&!this.gameOver) this.flipGravity(); });

    // الأصوات
    this.flipSound = this.sound.add("flip");
    this.bgMusic = this.sound.add("bg_audio",{ loop:true, volume:0.5 });

    // الأزرار
    this.startBtn = document.getElementById("start-btn");
    this.restartBtn = document.getElementById("restart-btn");
    this.gameOverText = document.getElementById("game-over-text");

    this.startBtn.addEventListener("click", ()=>{ 
      this.startBtn.style.display="none";
      this.gameOverText.style.display="none";
      this.restartBtn.style.display="none";
      this.startGame();
    });

    this.restartBtn.addEventListener("click", ()=>{ location.reload(); });
  }

  update() {
    if(!this.started || this.gameOver) return;

    this.bg.tilePositionX += this.speedX;
    this.groundTop.tilePositionX += this.speedX;
    this.groundBottom.tilePositionX += this.speedX;

    this.player.y = this.onGround ? 368 : 32;
    this.player.setFlipY(!this.onGround);

    this.obstacles.getChildren().forEach(ob=>{
      ob.x -= this.speedX;
      if(ob.x < -60){ 
        ob.destroy(); 
        this.score++; 
        this.scoreDiv.innerText="Score: "+this.score; 
      }
    });
  }

  startGame(){
    this.started = true;
    this.bgMusic.play();
    this.spawnEvent = this.time.addEvent({ delay:1500, callback:this.spawnObstacles, callbackScope:this, loop:true });
  }

  flipGravity(){ 
    this.onGround = !this.onGround; 
    this.flipSound.play(); 
    if(this.onGround) this.player.play("walkDown",true); 
    else this.player.play("walkUp",true); 
  }

  spawnObstacles(){
    const posY = Phaser.Math.Between(0,1) === 0 ? 400-this.groundBottom.displayHeight/2 : this.groundTop.displayHeight/2;
    const obstacle = this.obstacles.create(650, posY, "obstacle");
    obstacle.setDisplaySize(40,100);

    if(posY === this.groundTop.displayHeight/2){ 
      obstacle.setOrigin(0.5,0); 
      obstacle.setFlipY(true); 
    } else { 
      obstacle.setOrigin(0.5,1); 
      obstacle.setFlipY(false); 
    }

    obstacle.body.allowGravity = false;
  }

  endGame(){
    if(this.gameOver) return;
    this.gameOver = true; 
    this.started = false;
    this.physics.pause();
    this.gameOverText.style.display = "block";
    this.restartBtn.style.display = "inline-block";
    this.startBtn.style.display = "none";
    this.bgMusic.stop();
  }
}
