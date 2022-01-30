let bricks = 
[[0,1,2,3,4,5,6,7,8,9],
[10,11,12,13,14,15,16,17,18,19],
[20,21,22,23,24,25,26,27,28,29]]
let brickObjects = [];
let victory = true
const darkGrey = "#4d4b4b"
const lightGrey = "#a3a3a3"
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let x = canvas.width/2;
let y = canvas.height/2;
let dx = 1;
let dy = -1;
let dt = 1;
let dz = 1;
let ballRadius = 10;
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width-paddleWidth) / 2;
let paddleY = (canvas.height - paddleHeight*2);
let left = false;
let right = false;
let dPaddleX = 0;
let remove = false

class Brick{
  constructor(height, width, xPos, yPos, collision, color){
    this.height = height;
    this.width = width;
    this.xPos = xPos;
    this.yPos = yPos;
    this.collision = collision;
    this.color = color;
  }
}

function makeBricks(){
  for (let i = 0; i < bricks.length; i++) {
    for (let j = 0; j < bricks[i].length; j++) {
       brickObjects[j + i*10] = new Brick(30,49,10 + 49*j + 10*j, 10 + 30*i + 10*i, false, darkGrey)}}
}

makeBricks()

function drawBricks(){
  victory = true
  for (let i = 0; i < brickObjects.length; i++) {
  if(brickObjects[i].collision === false){ctx.beginPath();
  ctx.fillStyle = brickObjects[i].color;
  ctx.rect(brickObjects[i].xPos, brickObjects[i].yPos, brickObjects[i].width, brickObjects[i].height)
  ctx.fill()
  ctx.closePath()
  victory = false;}
  }
  if(victory){
    clearInterval(interval)
    ctx.fillStyle= "white";
    ctx.font = "italic bold 35pt Tahoma";
    ctx.fillText(" You Won!",167,230);
    ctx.fillStyle= "white";
    ctx.font = "italic bold 20pt Tahoma";
    ctx.fillText("Press 'r' to restart",174,270);
    document.addEventListener("keydown", restart, false);
  }
}

drawBricks()

function sleep(millis){
    let date = new Date();
    let curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}

function drawBall(){
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, Math.PI/2, Math.PI*2.5, false);
  ctx.fillStyle = "violet";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  if(left === true){dPaddleX = -1}
  if(right === true){dPaddleX = 1}
  if(paddleX < 0){dPaddleX = 1}
  if(paddleX + paddleWidth > 600){dPaddleX = -1} 
  ctx.beginPath();
  paddleX += dPaddleX
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  dPaddleX = 0
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for(let i = 0; i < brickObjects.length; i++){
    if(x + ballRadius >= brickObjects[i].xPos && x - ballRadius <= brickObjects[i].xPos + brickObjects[i].width && y + ballRadius >= brickObjects[i].yPos && y - ballRadius <= brickObjects[i].yPos + brickObjects[i].height){
     if(brickObjects[i].collision) continue; 
     if((x + ballRadius === brickObjects[i].xPos ||x - ballRadius === brickObjects[i].xPos + brickObjects[i].width)){if(remove === false)   {dx= -dx;
       remove = true;} 
      if(brickObjects[i].color === darkGrey)
      {brickObjects[i].color = lightGrey}
      else
      {brickObjects[i].collision = true}
      }
     if(y + ballRadius == brickObjects[i].yPos ||y - ballRadius === brickObjects[i].yPos + brickObjects[i].height){if(remove === false){dy= -dy;
      remove = true}
      if(brickObjects[i].color === darkGrey)
      {brickObjects[i].color = lightGrey}
      else
      {brickObjects[i].collision = true}
      }
     }
  }
  remove = false  
  drawBricks()
  if(y <= ballRadius) {
    dy = -dy;
  }
  if(y - ballRadius >= canvas.height + 3){
    clearInterval(interval)
    ctx.fillStyle= "white";
    ctx.font = "italic bold 35pt Tahoma";
    ctx.fillText("Game Over",167,230);
    ctx.fillStyle= "white";
    ctx.font = "italic bold 20pt Tahoma";
    ctx.fillText("Press 'r' to restart",174,270);
    document.addEventListener("keydown", restart, false);
  }
  if(x >= canvas.width - ballRadius|| x + dx < ballRadius) {
    dx = -dx;
  }
  if(y + ballRadius === paddleY && paddleX + paddleWidth - x < paddleWidth && paddleX + paddleWidth - x > 0){
    if(paddleX + paddleWidth/2 < x){dx=1}
    if(paddleX + paddleWidth/2 > x){dx=-1}
    dy = -dy
  }
  x += dx
  y += dy
  drawBall()
  drawPaddle()
}

function restart(e){
  if(e.key == "r"){
    makeBricks()
    drawBricks()
    x = canvas.width/2
    y = canvas.height/2
    dy = -1
    dx = 1
    interval = setInterval(draw, dt)
    document.removeEventListener("keydown", restart, false)
    }
    
}

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        right = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        left = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        right = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        left = false;
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

interval = setInterval(draw, dt)
