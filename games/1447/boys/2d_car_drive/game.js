const canvas=document.getElementById("gameCanvas");
const ctx=canvas.getContext("2d");

const bgImg=new Image(); bgImg.src="images/road.png";
const enemyImg=new Image(); enemyImg.src="images/enemy.png";
const playerImgs=[new Image(),new Image()];
playerImgs[0].src="images/player1.png";
playerImgs[1].src="images/player2.png";

const hitSound=new Audio("sounds/hit.mp3");

let player,obstacles,score,gameOver;
let frame=0,speed=4;

function initGame(){
player={x:170,y:420,width:60,height:40,speed:6};
obstacles=[]; score=0; speed=4; gameOver=false;
document.getElementById("score").innerText=score;
document.getElementById("restartBtn").style.display="none";
}

document.addEventListener("keydown",e=>{
if(gameOver)return;
if(e.key==="ArrowLeft"&&player.x>0)player.x-=player.speed;
if(e.key==="ArrowRight"&&player.x+player.width<canvas.width)player.x+=player.speed;
});

function createObstacle(){
const w=60,h=40;
const x=Math.random()*(canvas.width-w);
obstacles.push({x,y:-h,width:w,height:h});
}

function drawBackground(){ctx.drawImage(bgImg,0,0,canvas.width,canvas.height);}
function drawPlayer(){
const img=playerImgs[Math.floor(frame/15)%2];
ctx.drawImage(img,player.x,player.y,player.width,player.height);
}
function drawObstacles(){obstacles.forEach(o=>ctx.drawImage(enemyImg,o.x,o.y,o.width,o.height));}

function updateObstacles(){
obstacles.forEach(o=>o.y+=speed);
obstacles=obstacles.filter(o=>o.y<canvas.height);
obstacles.forEach(o=>{
if(player.x<o.x+o.width&&player.x+player.width>o.x&&player.y<o.y+o.height&&player.y+player.height>o.y){
hitSound.play(); gameOver=true;
}
});
}

function gameLoop(){
if(gameOver){
ctx.font="30px Arial";
ctx.fillText("Game Over",110,250);
document.getElementById("restartBtn").style.display="inline-block";
return;
}
ctx.clearRect(0,0,canvas.width,canvas.height);
drawBackground(); drawPlayer(); drawObstacles(); updateObstacles();
frame++; score++; speed+=0.001;
document.getElementById("score").innerText=score;
requestAnimationFrame(gameLoop);
}

function restartGame(){initGame(); gameLoop();}

setInterval(()=>{if(!gameOver)createObstacle();},900);

initGame(); gameLoop();