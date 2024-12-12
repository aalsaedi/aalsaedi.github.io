import gameScene from "./gameScene.js"
const config = {
    width: window.innerWidth,
    height: window,innerHeight,
   
    scene:[gameScene],
    scale: {
        mode: Phaser.Scale.RESIZE, 
        autoCenter: Phaser.Scale.CENTER_BOTH 
    },
    physics: {
        default: "arcade"
    }
}
window.onload = ()=>{
    const desertWaterRush = new Phaser.Game(config)
    
}



