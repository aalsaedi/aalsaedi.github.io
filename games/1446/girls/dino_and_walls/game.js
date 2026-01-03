let dino, ground, obstacles = [], score = 0, isJumping = false, gameOver = false;
let jumpSound, hitSound, bgMusic;
let gravity = 0.5;
let jumpHeight = -18;
let obstacleSpeed = -5;
let difficultyIncrease = 0.1; 
let level = 1;
let backgroundImage;
let scoreIncrementRate = 5;

// Game scenes
let gameScene = "start"; 

// Preload assets
function preload() {
  dinoWalk1 = loadImage('assets/dinoWalk1.png');
  dinoWalk2 = loadImage('assets/dinoWalk2.png');
  birdImage = loadImage('assets/bird.png');
  wallImage = loadImage('assets/wall.png');
  backgroundImage = loadImage('assets/background.jpg');

  jumpSound = new Howl({ src: ['assets/jump.mp3'], volume: 0.5 });
  hitSound = new Howl({ src: ['assets/hit.wav'], volume: 0.5 });
  bgMusic = new Howl({ src: ['assets/background-music.mp3'], loop: true, volume: 0.7 });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  dino = new Dino();
  ground = new Ground();

  document.addEventListener('keydown', () => {
    if (!bgMusic.playing()) {
      bgMusic.play();
    }
  });
}

function draw() {
  background(backgroundImage);

  if (gameScene === "start") {
    startScene();
  } else if (gameScene === "game") {
    gameSceneFunction();
  }
}

function startScene() {
  background(0);
  fill(255);
  textSize(48);
  textAlign(CENTER, CENTER);
  text("Press Space to Start", width / 2, height / 2);

  if (keyIsPressed && key === ' ' && !gameOver) {
    gameScene = "game";
    resetGame();
  }
}

function gameSceneFunction() {
  if (!gameOver) {
    ground.update();
    dino.update();
    handleObstacles();
    handleCollisions();
    displayScore();
    displayLevel();
    updateDifficulty();

    if (frameCount % scoreIncrementRate === 0) {
      score += 5;
    }
  } else {
    gameOverScreen();
  }
}

class Dino {
  constructor() {
    this.x = 50;
    this.y = height - 100;
    this.width = 120;
    this.height = 120;
    this.yVelocity = 0;
    this.xVelocity = 0;
    this.speed = 5;
    this.walkingFrame = 0;
  }

  update() {
    this.yVelocity += gravity;
    this.y += this.yVelocity;

    if (this.y > height - 100) {
      this.y = height - 100;
      this.yVelocity = 0;
    }

    if (isJumping && this.y == height - 100) {
      this.yVelocity = jumpHeight;
      jumpSound.play();
      isJumping = false;
    }

    this.x += this.xVelocity;

    if (this.x < 0) {
      this.x = 0;
    } else if (this.x + this.width > width) {
      this.x = width - this.width;
    }

    this.walkingFrame = this.xVelocity !== 0 ? (this.walkingFrame + 1) % 30 : this.walkingFrame;

    if (this.walkingFrame < 15) {
      image(dinoWalk1, this.x, this.y, this.width, this.height);
    } else {
      image(dinoWalk2, this.x, this.y, this.width, this.height);
    }
  }
}

class Ground {
  constructor() {
    this.x = 0;
    this.y = height - 20;
    this.width = width;
  }

  update() {
    fill(255);
    rect(this.x, this.y, this.width, 20);
  }
}

function handleObstacles() {
  let obstacleFrequency = level < 4 ? 90 : max(30, 90 - level * 5);

  if (frameCount % obstacleFrequency === 0 && !gameOver) {
    obstacles.push(new Obstacle());
  }

  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].update();

    if (obstacles[i].x + obstacles[i].width < 0) {
      if (obstacles[i].type === 'wall') {
        score += 5;
      }
      obstacles.splice(i, 1);
    }
  }
}

class Obstacle {
  constructor() {
    this.x = width;
    this.width = 80;
    this.height = 100;
    this.type = random(1) > 0.4 ? 'bird' : 'wall';

    if (this.type === 'bird') {
      this.y = random(height / 4, height / 2);
    } else {
      this.y = height - this.height - 30;
    }
  }

  update() {
    this.x += obstacleSpeed;

    if (this.type === 'bird') {
      image(birdImage, this.x, this.y, this.width, this.height);
    } else {
      image(wallImage, this.x, this.y, this.width, this.height);
    }
  }
}

function handleCollisions() {
  for (let i = 0; i < obstacles.length; i++) {
    if (dino.x < obstacles[i].x + obstacles[i].width &&
        dino.x + dino.width > obstacles[i].x &&
        dino.y < obstacles[i].y + obstacles[i].height &&
        dino.y + dino.height > obstacles[i].y) {
      hitSound.play();
      gameOver = true;
    }
  }
}

function displayScore() {
  fill(255);
  textSize(32);
  text("Score: " + score, 100, 40);
}

function displayLevel() {
  fill(255);
  textSize(32);
  text("Level: " + level, width - 150, 40);
}

function gameOverScreen() {
  fill(255);
  textSize(48);
  textAlign(CENTER);
  text("Game Over", width / 2, height / 2 - 50);
  textSize(32);
  text(`Final Score: ${score}`, width / 2, height / 2);
  text("Press R to Restart", width / 2, height / 2 + 50);
}

function updateDifficulty() {
  level = Math.floor(score / 800) + 1;

  if (level > 2) {
    obstacleSpeed -= difficultyIncrease * 0.15; 
  } else if (score % 800 === 0 && score !== 0) {
    obstacleSpeed -= difficultyIncrease;
  }
}

function keyPressed() {
  if (keyCode === 32 && !isJumping && !gameOver) {
    isJumping = true;
  }

  if (key === 'a' || keyCode === LEFT_ARROW) {
    dino.xVelocity = -dino.speed;
  } else if (key === 'd' || keyCode === RIGHT_ARROW) {
    dino.xVelocity = dino.speed;
  }

  if (key === 'r' || key === 'R') {
    resetGame();
  }

  if (gameScene === "start" && key === ' ') {
    gameScene = "game";
  }
}

function keyReleased() {
  if (key === 'a' || keyCode === LEFT_ARROW || key === 'd' || keyCode === RIGHT_ARROW) {
    dino.xVelocity = 0;
  }
}

function resetGame() {
  score = 0;
  level = 1;
  gameOver = false;
  obstacles = [];
  obstacleSpeed = -5;
  dino.y = height - 100;
}
