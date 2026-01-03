import FirstScene from './firstScene.js';
import EndGame from './EndGame.js';


var config = {
    type: Phaser.AUTO, // Auto select WebGL or Canvas depending on device
    width: 600,
    height: 360,
    backgroundColor: "white",
    scene:  [FirstScene, EndGame], // Add all scenes
    physics: {
        default: 'arcade', // Setting up virtual physics
        arcade: {
            gravity: 0, // Adjust gravity for all scenes
            debug: false // Cancel debug mode
        }
    }
}
document.fonts.load('1em "Arcade Gamer"').then(() => {
    console.log('Font Arcade Gamer loaded!');
});
window.onload=function(){
    var game=new Phaser.Game(config);
}
export default config;
