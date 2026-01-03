import { fadeIn, fadeOut, initUI, updateScoreDisplay } from "./ui.js";

const STATE_MENU = "MENU";
const STATE_PLAYING = "PLAYING";
const STATE_GAMEOVER = "GAMEOVER";

class MainScene extends Phaser.Scene {

    constructor() {
        super('main');
    }

    preload() {

        this.load.image('bgDay', 'assets/green_background_day.png');
        this.load.image('bgNight', 'assets/green_background_night.png');
        this.load.image('roadDay', 'assets/road_day.png');
        this.load.image('roadNight', 'assets/road_night.png');
        this.load.image('carLight', 'assets/car_light.png');
        this.load.image('arrows', 'assets/arrows.png');
        
        this.load.image('bustedPanel', 'assets/busted_panel.png');
        this.load.image('bustedPanelHover', 'assets/busted_panel_hover.png');
        this.load.image('changeCar', 'assets/change_car.png');
        this.load.image('changeCarHover', 'assets/change_car_hover.png');
        this.load.image('dayMode', 'assets/day_mode.png');
        this.load.image('dayModeHover', 'assets/day_mode_hover.png');
        this.load.image('nightMode', 'assets/night_mode.png');
        this.load.image('nightModeHover', 'assets/night_mode_hover.png');
        this.load.image('musicOn', 'assets/music_on.png');
        this.load.image('musicOnHover', 'assets/music_on_hover.png');
        this.load.image('musicOff', 'assets/music_off.png');
        this.load.image('musicOffHover', 'assets/music_off_hover.png');

        for (let i = 1; i <= 6; i++) this.load.image(`title${i}`, `assets/title${i}.png`);
        for (let i = 1; i <= 7; i++) this.load.image(`playerCar${i}`, `assets/player_car${i}.png`);
        for (let i = 1; i <= 6; i++) this.load.image(`trafficCar${i}`, `assets/traffic_car${i}.png`);
        for (let i = 1; i <= 3; i++) this.load.image(`police${i}`, `assets/police${i}.png`);
        for (let i = 1; i <= 3; i++) this.load.image(`warning${i}`, `assets/warning${i}.png`);
        for (let i = 1; i <= 3; i++) this.load.image(`criticalHealth${i}`, `assets/critical_health${i}.png`);
        for (let i = 0; i <= 3; i++) this.load.image(`health${i}`, `assets/health${i}.png`);
        for (let i = 0; i <= 9; i++) this.load.image(`${i}`, `assets/${i}.png`);

        this.load.audio('click', 'audio/click.ogg');
        this.load.audio('crash', 'audio/crash.ogg');
        this.load.audio('beat', 'audio/beat.ogg');
        this.load.audio('siren', 'audio/siren.ogg');

        for (let i = 0; i <= 7; i++) this.load.audio(`music${i}`, `audio/music${i}.mp3`);

    }

    create() {

        this.gameState = STATE_MENU;
        this.isDay = true;
        this.health = 3;
        this.playerCarNumber = 1;

        this.score = 0;
        this.highScore = 0;
        this.bustedScoreDigits = [];
        this.bustedHighScoreDigits = [];

        // Timer increments the score
        this.scoreTimer = this.time.addEvent({
            delay: 33,
            loop: true,
            callback: () => {
                if (this.gameState === STATE_PLAYING) {
                    this.score++;
                    updateScoreDisplay(this, this.score);
                }
            }
        });

        this.trafficCars = [];
        this.scheduleTrafficCar();

        this.policeActive = false;
        this.policeMove = null;
        this.warningFollow = null;

        this.clickSound = this.sound.add('click');
        this.sirenSound = this.sound.add('siren');

        // Music
        this.currentMusic = null; 
        this.musicTracks = [];

        for (let i = 0; i <= 7; i++) {
            const music = this.sound.add(`music${i}`, { loop: false });
            this.musicTracks.push(music);

            // auto-restart when finished
            music.on('complete', () => {
                if (this.musicOn) music.play();
            });
        }

        this.musicOn = true;
        this.playMusic(0);

        this.cursors = this.input.keyboard.createCursorKeys();

        initUI(this);

    }

    update() {

        this.scrollRoads();

        if(this.gameState === STATE_MENU)
            this.updateMenu();
        else if(this.gameState === STATE_PLAYING)
            this.updatePlaying();

    }

    updateMenu() {
        if (this.cursors.left.isDown || this.cursors.right.isDown)
            this.startGame();
    }

    updatePlaying() {
        this.carMovement();
        this.checkCollisions();
    }

    startGame() {

        this.gameState = STATE_PLAYING;
        this.score = 0;

        fadeOut(this, this.title);
        fadeOut(this, this.arrows);
        fadeOut(this, this.dayNightBtn);
        fadeOut(this, this.changeCarBtn);
        fadeOut(this, this.musicBtn);

        fadeIn(this, this.healthBar);

        // Play music corresponding to player car
        this.playMusic(this.playerCarNumber);

        // Reset police
        if (this.policeMove) this.policeMove.remove();
        this.policeMove = null;
        if (this.warningFollow) this.warningFollow.remove();
        this.warningFollow = null;
        this.policeCar.setVisible(false);
        this.policeActive = false;

        // Start first police cycle
        this.time.delayedCall(8500, () => { 
            if (this.gameState === STATE_PLAYING && !this.policeActive) {
                this.showWarning();
            }
        });

    }

    gameOver() {

        this.gameState = STATE_GAMEOVER;

        if(this.score > this.highScore)
            this.highScore = this.score;

        this.playerCar.setVisible(false);
        this.carLight.setAlpha(0);

        // Stop police and warning
        if (this.policeMove) this.policeMove.remove();
        this.policeMove = null;

        if (this.warningFollow) this.warningFollow.remove();
        this.warningFollow = null;

        this.policeCar.setVisible(false);
        this.policeActive = false;
        this.warning.setVisible(false);

        // Hide gameplay UI
        fadeOut(this, this.healthBar);
        this.scoreDigits.forEach(d => d.setVisible(false));

        // Show busted panel
        fadeIn(this, this.bustedPanel);
        this.displayBustedScores(this.score, this.highScore);

        this.playMusic(0);

    }

    returnToMenu() {

        this.gameState = STATE_MENU;

        // Clear traffic
        this.trafficCars.forEach(car => car.destroy());
        this.trafficCars = [];

        fadeOut(this, this.bustedPanel);

        // Reset score & health
        this.score = 0;
        this.health = 3;
        this.healthBar.setTexture('health3');

        // Reset player
        this.playerCar.x = 640;
        this.playerCar.vx = 0;
        this.playerCar.angle = 0;
        this.playerCar.setVisible(true);

        this.carLight.x = 640;
        this.carLight.vx = 0;
        this.carLight.angle = 0;
        this.carLight.setAlpha(this.isDay ? 0 : 0.5);

        fadeIn(this, this.title);
        fadeIn(this, this.arrows);
        fadeIn(this, this.dayNightBtn);
        fadeIn(this, this.changeCarBtn);
        fadeIn(this, this.musicBtn);

        if (!this.musicTracks[0].isPlaying && this.musicOn)
            this.playMusic(0);
        
    }


    scrollRoads() {
        // Set speed based on game state
        let speed = 0;

        switch (this.gameState) {
            case STATE_MENU:
                speed = 3;
                break;
            case STATE_PLAYING:
                speed = 5;
                break;
            case STATE_GAMEOVER:
                speed = 2;
                break;
        }

        const resetPoint = 558 + this.roadH / 2;

        this.road1.y += speed;
        this.road2.y += speed;

        if (this.road1.y >= resetPoint) 
            this.road1.y = this.road2.y - this.roadH;
        
        if (this.road2.y >= resetPoint) 
            this.road2.y = this.road1.y - this.roadH;
    }    

    carMovement(){

        const acceleration = 0.12;
        const maxSpeed = 5;
        const friction = 0.04;
        const tilt = 2;

        // acceleration
        if (this.cursors.left.isDown) {
            this.playerCar.vx -= acceleration;
        }
        else if (this.cursors.right.isDown) {
            this.playerCar.vx += acceleration;
        }
        else {
            // friction
            this.playerCar.vx *= (1 - friction);
        }

        // clamp speed
        this.playerCar.vx = Phaser.Math.Clamp(this.playerCar.vx, -maxSpeed, maxSpeed);

        // move car
        this.playerCar.x += this.playerCar.vx;

        // tilt based on speed
        this.playerCar.angle = this.playerCar.vx * tilt;

        // keep car inside the road
        const leftLimit = 455;
        const rightLimit = 825;
        this.playerCar.x = Phaser.Math.Clamp(this.playerCar.x, leftLimit, rightLimit);

        // --- CAR LIGHT ORBIT ---
        const distance = 140; // how far the light is from the car
        const angleRad = Phaser.Math.DegToRad(this.playerCar.angle);

        // Offset rotates with the car tilt
        this.carLight.x = this.playerCar.x + Math.sin(angleRad) * distance;
        this.carLight.y = this.playerCar.y - Math.cos(angleRad) * distance;

        // Match rotation
        this.carLight.angle = this.playerCar.angle;

    }

    showWarning() {
        if (this.gameState !== STATE_PLAYING || this.policeActive) return;

        this.warning.x = this.playerCar.x;
        this.warning.y = this.playerCar.y + 85;
        this.warning.setVisible(true);
        this.sirenSound.play();

        this.warningFollow = this.time.addEvent({
            delay: 16,
            loop: true,
            callback: () => {
                this.warning.x = this.playerCar.x;
            }
        });

        this.time.delayedCall(800, () => {
            if (this.warningFollow) this.warningFollow.remove();
            this.warningFollow = null;

            this.lastPoliceX = Phaser.Math.Clamp(this.warning.x, 455, 825);

            this.time.delayedCall(400, () => {
                this.warning.setVisible(false);
                this.spawnPolice();
            });
        });
    }

    spawnPolice() {

        if (this.policeActive || this.gameState !== STATE_PLAYING) return;

            this.policeActive = true;
            this.policeCar.setVisible(true);
            this.policeCar.x = this.lastPoliceX;
            this.policeCar.y = 600; 

            const speed = 10;

            this.policeMove = this.time.addEvent({
                delay: 16,
                loop: true,
                callback: () => {
                    this.policeCar.y -= speed;

                    if (this.policeCar.y < -100) {
                        this.cleanupPolice();
                    }
                }
            });
    }

    getPoliceDelay() {
        if (this.score > 7000) return Phaser.Math.Between(1000, 3000);
        if (this.score > 5000) return Phaser.Math.Between(3000, 5000);
        if (this.score > 1000) return Phaser.Math.Between(5000, 7000);
        return Phaser.Math.Between(7000, 8000);
    }

    schedulePoliceEvent() {
        if (this.gameState !== STATE_PLAYING) return;
        if (this.policeActive) return;

        this.time.delayedCall(this.getPoliceDelay(), () => {
            if (this.gameState !== STATE_PLAYING) return;
            if (this.policeActive) return;

            this.showWarning();
        });
    }

    cleanupPolice() {
        if (!this.policeActive) return;

        this.policeActive = false;

        if (this.policeMove) {
            this.policeMove.remove();
            this.policeMove = null;
        }
        if (this.warningFollow) {
            this.warningFollow.remove();
            this.warningFollow = null;
        }

        this.policeCar.setVisible(false);
        this.warning.setVisible(false);

        if (this.gameState === STATE_PLAYING) {
            this.time.delayedCall(this.getPoliceDelay(), () => {
                this.showWarning();
            });
        }
    }


    spawnTrafficCar() {

        if (this.gameState !== "PLAYING") return;

        const carNum = Phaser.Math.Between(1, 6);
        const carTexture = 'trafficCar' + carNum;

        const positions = [480, 560, 640, 720, 800];
        const x = Phaser.Utils.Array.GetRandom(positions);

        const car = this.add.image(x, -50, carTexture);
        car.setScale(1.6);
        if(!this.isDay)
            car.setTint(0xAAAAAA);

        this.trafficCars.push(car);

        const speed = 9;

        const move = this.time.addEvent({
            delay: 16,
            loop: true,
            callback: () => {
                if (this.gameState !== "PLAYING") {
                    car.destroy();
                    move.remove();
                    return;
                }

                car.y += speed;

                if (car.y > 600) {
                    car.destroy();
                    move.remove();
                }
            }
        });
    }

    scheduleTrafficCar() {
        const delay = this.getTrafficDelay() * 1000;

        this.time.delayedCall(delay, () => {
            this.spawnTrafficCar();
            this.scheduleTrafficCar();
        });
    }   

    getTrafficDelay() {
        if (this.score > 5000) return Phaser.Math.FloatBetween(0.1, 1);
        if (this.score > 3000) return Phaser.Math.FloatBetween(0.2, 2);
        if (this.score > 2000) return Phaser.Math.FloatBetween(0.4, 2.5);
        if (this.score > 1000) return Phaser.Math.FloatBetween(0.8, 3);
        return Phaser.Math.FloatBetween(1, 4);
    }


    checkCollisions() {
        const player = this.playerCar;

        // --- Player vs Traffic ---
        for (let i = this.trafficCars.length - 1; i >= 0; i--) {
            const car = this.trafficCars[i];
            if (car.visible && Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), car.getBounds())) {
                car.setVisible(false);
                this.trafficCars.splice(i, 1);
                this.sound.play('crash');
                this.cameras.main.shake(150, 0.01);
                this.showCollisionParticles(car.x, car.y);
                this.DecreaseHealth();
            }
        }

        // --- Player vs Police ---
        if (this.policeActive && this.policeCar.visible &&
            Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), this.policeCar.getBounds())) {

            this.sound.play('crash');
            this.cameras.main.shake(100, 0.01);
            this.showCollisionParticles(this.policeCar.x, this.policeCar.y);
            this.DecreaseHealth();
            this.cleanupPolice();
        }

        // --- Police vs Traffic ---
        if (this.policeActive && this.policeCar.visible) {
            for (let i = this.trafficCars.length - 1; i >= 0; i--) {
                const car = this.trafficCars[i];
                if (car.visible && Phaser.Geom.Intersects.RectangleToRectangle(this.policeCar.getBounds(), car.getBounds())) {

                    this.sound.play('crash', { volume: 0.3 });
                    this.cameras.main.shake(50, 0.01);
                    this.showCollisionParticles(car.x, car.y);
                    car.destroy();
                    this.trafficCars.splice(i, 1);
                    this.cleanupPolice();
                    break;
                }
            }
        }
    }

    showCollisionParticles(x, y) {
        const particleCount = 15;

        for (let i = 0; i < particleCount; i++) {
            const size = Phaser.Math.Between(5, 10);
            const square = this.add.rectangle(x, y, size, size, 0x000000);
            square.alpha = 0.8;

            // Random velocity
            const vx = Phaser.Math.Between(-30, 30) / 10; // horizontal
            const vy = Phaser.Math.Between(20, 60) / 10;  // downward

            // Random rotation speed
            const angularVelocity = Phaser.Math.Between(-180, 360); // degrees per second

            this.tweens.add({
                targets: square,
                x: square.x + vx * 30,
                y: square.y + vy * 30,
                angle: square.angle + angularVelocity, // rotate while moving
                alpha: 0,
                duration: 1000 + Phaser.Math.Between(0, 200),
                ease: 'Cubic.easeOut',
                onComplete: () => square.destroy()
            });
        }

    }


    DecreaseHealth() {

        if (this.health <= 0) return;

        this.health--;
        this.healthBar.setTexture('health' + this.health);

        this.hitHealthBar();
        
        if(this.health < 1)
            this.gameOver();

        if (this.health === 1){
            this.startHeartbeat();
            this.criticalMsg.setVisible(true);
        }else{
            this.stopHeartbeat();
            this.criticalMsg.setVisible(false);
        }
    }

    hitHealthBar() {
        // Flash
        this.tweens.add({
            targets: this.healthBar,
            alpha: 0.2,
            duration: 60,
            yoyo: true,
            repeat: 2
        });

        // Shake (X only)
        this.tweens.add({
            targets: this.healthBar,
            x: this.healthBar.x + 6,
            duration: 40,
            yoyo: true,
            repeat: 4
        });
    }

    startHeartbeat() {
        if (this.heartbeatTimer) return;

        const pattern = [250, 500]; // delays in ms
        let index = 0;

        const playBeat = () => {
            if (this.health !== 1) return; // stop if health changed

            // --- Play sound ---
            this.beatSound.play();

            // --- Pulse health bar ---
            this.healthBar.setScale(1.8); 
            this.tweens.add({
                targets: this.healthBar,
                scale: 1.7,            
                duration: 150,         
                ease: 'Sine.easeInOut'
            });

            // schedule next beat
            this.heartbeatTimer = this.time.delayedCall(pattern[index], () => {
                index = (index + 1) % pattern.length;
                playBeat();
            });
        };

        playBeat();
    }

    stopHeartbeat() {
        if (this.heartbeatTimer) this.heartbeatTimer.remove();
        this.heartbeatTimer = null;

        // Reset size
        this.healthBar.setScale(1.7);
    }


    toggleMusic(){
        this.musicOn = !this.musicOn;

        if (this.musicOn) {
            // resume current track
            if (this.currentMusic) this.currentMusic.play();
            this.musicBtn.setTexture('musicOnHover');
        } else {
            // stop all music
            this.musicTracks.forEach(m => m.stop());
            this.musicBtn.setTexture('musicOffHover');
        }
    }

    playMusic(index) {
        if (!this.musicOn) return;

        // stop current music
        if (this.currentMusic && this.currentMusic.isPlaying) {
            this.currentMusic.stop();
        }
        // play new music
        this.currentMusic = this.musicTracks[index];
        if (!this.currentMusic.isPlaying) {
            this.currentMusic.play();
        }
    }

    changeCar(){

        if(this.playerCarNumber<7)
            this.playerCarNumber += 1;
        else
            this.playerCarNumber = 1;

        this.playerCar.setTexture('playerCar'+this.playerCarNumber);

    }

    toggleDayNight() {
        this.isDay = !this.isDay;

        if (this.isDay) {
            this.bg.setTexture('bgDay');
            this.road1.setTexture('roadDay');
            this.road2.setTexture('roadDay');
            this.dayNightBtn.setTexture('dayModeHover');
            this.playerCar.clearTint();
            this.policeCar.clearTint();
            this.carLight.setAlpha(0);
        } else {
            this.bg.setTexture('bgNight');
            this.road1.setTexture('roadNight');
            this.road2.setTexture('roadNight');
            this.dayNightBtn.setTexture('nightModeHover');
            this.playerCar.setTint(0xAAAAAA); 
            this.policeCar.setTint(0xAAAAAA);
            this.carLight.setAlpha(0.5);
        }
    }


   displayBustedScores(score, highScore) {

        // Clear old digits
        this.bustedScoreDigits.forEach(d => d.destroy());
        this.bustedScoreDigits = [];

        this.bustedHighScoreDigits.forEach(d => d.destroy());
        this.bustedHighScoreDigits = [];

        // --- score ---
        const scoreStr = score.toString();
        let x = 650 - (scoreStr.length * 24) / 2;
        const y = 292;

        for (let i = 0; i < scoreStr.length; i++) {
            const digit = this.add.image(x, y, scoreStr[i]);
            digit.setScale(1.4);
            this.bustedScoreDigits.push(digit);
            x += 20;
        }

        // --- High score ---
        const highStr = highScore.toString();
        let hx = 650 - (highStr.length * 24) / 2;
        const hy = 358;

        for (let i = 0; i < highStr.length; i++) {
            const digit = this.add.image(hx, hy, highStr[i]);
            digit.setScale(1.4);
            this.bustedHighScoreDigits.push(digit);
            hx += 20;
        }
    }


}


const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 558,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MainScene]
};

const game = new Phaser.Game(config);
