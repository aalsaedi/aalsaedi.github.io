import BootScene from './scenes/Boot.js';
import PreloadScene from './scenes/Preload.js';
import MenuScene from './scenes/Menu.js';
import PlayScene from './scenes/Play.js';
import ShopScene from './scenes/Shop.js';
import CreditsScene from './scenes/Credits.js';

export var gameState = {
    totalGold: 0,
    suitLevel: 1,
    oxygenMax: 100,
    swimSpeed: 200,
    unlockedZones: 1,
    settings: {
        volume: 0.5,
        resolution: "1080p",
        fullScreen: false
    }
};

const config = {
    input: {
        gamepad: true
    },

    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    backgroundColor: '#0000aa', 
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: { 
            gravity: { y: 0 },
            debug: false 
        }
    },
    scene: [BootScene, PreloadScene, MenuScene, PlayScene, ShopScene, CreditsScene]
};

console.log("Main.js loaded. Starting Game...");
const game = new Phaser.Game(config);