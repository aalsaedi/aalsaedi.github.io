
export function initUI(scene) {

    initBackgroundAndRoad(scene);

    initDayNightBtn(scene);
    initChangeCarBtn(scene);
    initmusicBtn(scene);

    initPlayerCar(scene);
    initArrows(scene);

    initHealthBar(scene);
    initTitle(scene);
    initCriticalMessage(scene);
    initScoreUI(scene);

    initPoliceAndWarning(scene);
    initBustedPanel(scene);

}

export function fadeOut(scene, obj, duration = 300) {
    scene.tweens.add({
        targets: obj,
        alpha: 0,
        duration: duration,
        onComplete: () => {
            obj.setVisible(false);
        }
    });
}

export function fadeIn(scene, obj, duration = 300) {
    obj.setVisible(true);
    obj.setAlpha(0);

    scene.tweens.add({
        targets: obj,
        alpha: 1,
        duration: duration
    });
}

export function updateScoreDisplay(scene, score) {
    // Clear old digits
    scene.scoreDigits.forEach(d => d.destroy());
    scene.scoreDigits = [];

    const scoreStr = score.toString();
    let x = scene.scoreCenterX - (scoreStr.length * scene.digitWidth) / 2;

    for (let i = 0; i < scoreStr.length; i++) {
        const digit = scene.add.image(x, scene.scoreY, scoreStr[i]);
        digit.setScale(1.7);
        scene.scoreDigits.push(digit);
        x += scene.digitWidth;
    }
}

function initTitle(scene){

    scene.titleIndex = 1;
    scene.titleFrameCount = 6;
    scene.title = scene.add.image(640, 100, 'title1');

    // Frame cycling
    scene.time.addEvent({
        delay: 150,
        callback: () => {
            scene.titleIndex++;
            if (scene.titleIndex > scene.titleFrameCount) scene.titleIndex = 1;
            scene.title.setTexture('title' + scene.titleIndex);
        },
        loop: true
    });

    // Rotation + scale animation
    scene.tweens.add({
        targets: scene.title,
        angle: { from: -5, to: 5 },
        scale: { from: 1.2, to: 1.9 },
        duration: 600,
        yoyo: true,
        repeat: -1
    });

}

function initBustedPanel(scene) {

    scene.bustedPanel = scene.add.image(640, 279, 'bustedPanel').setInteractive();
    scene.bustedPanel.setScale(1.6)
    scene.bustedPanel.setVisible(false);

    // Hover
    scene.bustedPanel.on('pointerover', () => {
        scene.bustedPanel.setTexture('bustedPanelHover');
    });

    // Un-hover
    scene.bustedPanel.on('pointerout', () => {
        scene.bustedPanel.setTexture('bustedPanel');
    });

    // Click
    scene.bustedPanel.on('pointerdown', () => {
        scene.sound.play('click');

        // Destroy score digits
        scene.bustedScoreDigits.forEach(d => d.destroy());
        scene.bustedScoreDigits = [];

        // Destroy high score digits
        scene.bustedHighScoreDigits.forEach(d => d.destroy());
        scene.bustedHighScoreDigits = [];

        scene.returnToMenu();
    });
}

function initBackgroundAndRoad(scene) {
    
    scene.bg = scene.add.image(640, 279, 'bgDay').setDisplaySize(1280, 558);

    const roadW = 500;
    const roadH = 558;

    scene.road1 = scene.add.image(640, 0, 'roadDay').setDisplaySize(roadW, roadH);
    scene.road2 = scene.add.image(640, -roadH, 'roadDay').setDisplaySize(roadW, roadH);

    scene.roadH = roadH;

}

function initArrows(scene) {

    scene.arrows = scene.add.image(640, 450, 'arrows');
    scene.arrows.setScale(1.7);

    scene.tweens.add({
        targets: scene.arrows,
        alpha: { from: 0, to: 0.5 }, // fade in and out
        duration: 800,             // fade in duration
        yoyo: true,                // fade back out
        repeat: -1                 // loop forever
    });

}

function initPlayerCar(scene) {

    scene.playerCar = scene.add.image(640, 440, 'playerCar1');
    scene.playerCar.setScale(1.6);

    scene.cursors = scene.input.keyboard.createCursorKeys();
    scene.playerCar.vx = 0;

    // CAR LIGHT
    scene.carLight = scene.add.image(640, 300, 'carLight');
    scene.carLight.setScale(1.7);
    scene.carLight.setAlpha(0);

}

function initDayNightBtn(scene) {

    scene.dayNightBtn = scene.add.image(100, 320, 'dayMode').setInteractive();
    scene.dayNightBtn.setScale(1.4);

    // Hover
    scene.dayNightBtn.on('pointerover', () => {
        scene.dayNightBtn.setTexture(scene.isDay ? 'dayModeHover' : 'nightModeHover');
    });

    // Un-hover
    scene.dayNightBtn.on('pointerout', () => {
        scene.dayNightBtn.setTexture(scene.isDay ? 'dayMode' : 'nightMode');
    });

    // Click
    scene.dayNightBtn.on('pointerdown', () => {
        scene.sound.play('click');
        scene.toggleDayNight();
    });

}

function initChangeCarBtn(scene) {

    scene.changeCarBtn = scene.add.image(107, 400, 'changeCar').setInteractive();
    scene.changeCarBtn.setScale(1.4);

    // Hover
    scene.changeCarBtn.on('pointerover', () => {
        scene.changeCarBtn.setTexture('changeCarHover');
    });

    // Un-hover
    scene.changeCarBtn.on('pointerout', () => {
        scene.changeCarBtn.setTexture('changeCar');
    });

    // Click
    scene.changeCarBtn.on('pointerdown', () => {
        scene.sound.play('click');
        scene.changeCar();
    });

}

function initmusicBtn(scene) {

    scene.musicBtn = scene.add.image(100, 480, 'musicOn').setInteractive();
    scene.musicBtn.setScale(1.4);

    // Hover
    scene.musicBtn.on('pointerover', () => {
        scene.musicBtn.setTexture(scene.musicOn ? 'musicOnHover' : 'musicOffHover');
    });

    // Un-hover
    scene.musicBtn.on('pointerout', () => {
        scene.musicBtn.setTexture(scene.musicOn ? 'musicOn' : 'musicOff');
    });

    // Click
    scene.musicBtn.on('pointerdown', () => {
        scene.sound.play('click');
        scene.toggleMusic();
    });

}

function initHealthBar(scene){

    scene.healthBar = scene.add.image(1205, 130, 'health3').setScale(1.7);
    scene.healthBar.setVisible(false);

    // Heartbeat sound
    scene.beatSound = scene.sound.add('beat', { volume: 0.6 });

    // Heartbeat tween placeholder
    scene.heartbeatTween = null;

}

function initCriticalMessage(scene){

    scene.criticalIndex = 1;

    scene.criticalMsg = scene.add.image(640, 100, 'criticalHealth1');
    scene.criticalMsg.setScale(1.6);
    scene.criticalMsg.setVisible(false);
    scene.criticalMsg.setDepth(1000);

    scene.criticalTimer = scene.time.addEvent({
        delay: 100,
        loop: true,
        callback: () => {
            if (!scene.criticalMsg.visible) return;

            scene.criticalIndex++;
            if (scene.criticalIndex > 3) scene.criticalIndex = 1;

            scene.criticalMsg.setTexture('criticalHealth' + scene.criticalIndex);
        }
    });

}

function initScoreUI(scene) {
    scene.scoreDigits = [];
    scene.scoreCenterX = 652;
    scene.scoreY = 40;
    scene.digitWidth = 24;
}

function initPoliceAndWarning(scene) {

    scene.warningIndex = 1;
    scene.policeIndex = 1;

    scene.warning = scene.add.image(0, 0, 'warning1');
    scene.warning.setScale(1.6);
    scene.warning.setVisible(false);

    // warning animation
    scene.warningAnim = scene.time.addEvent({
        delay: 100,
        loop: true,
        callback: () => {
            scene.warningIndex++;
            if (scene.warningIndex > 3) scene.warningIndex = 1;
            scene.warning.setTexture('warning' + scene.warningIndex);
        }
    });


    scene.policeCar = scene.add.image(0, -100, 'police1');
    scene.policeCar.setScale(1.6);
    scene.policeCar.setVisible(false);

    scene.policeAnim = scene.time.addEvent({
        delay: 100,
        loop: true,
        callback: () => {
            scene.policeIndex++;
            if (scene.policeIndex > 3) scene.policeIndex = 1;
            scene.policeCar.setTexture('police' + scene.policeIndex);
        }
    });


}


