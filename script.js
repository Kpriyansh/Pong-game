const body = document.querySelector("body");
const canvas = document.createElement('canvas');
const context = canvas.getContext("2d");
const width = 500;
const height = 700;
const screen_width = screen.width;
const canvasPosition = screen_width / 2 - width / 2;
const playAgain = document.createElement('div');


//Paddle
let paddleBottomX = 225;
let paddleTopX = 225;
const paddle_height = 10;
const paddle_width = 50;
const paddle_diff = 25;
let paddle_contact = false;
let player_moved = false;
//Ball
let ballX = 250;
let ballY = 350;
let ball_radius = 5;
let trajectoryX;
//Score system
let playerScore = 0;
let computerScore = 0;
const winingScore = 5;
//game
let isPaused = true;
let isGameOver = true;
let isNewGame = true;
//speed
let speedX;
let speedY;
let computerSpeed;
const createCanvas = () => {
  canvas.height = height;
  canvas.width = width;
  console.log(canvas.width);
  body.appendChild(canvas);
  renderCanvas();
}

const renderCanvas = () => {
  //canvas
  context.fillStyle = 'rgb(21, 58, 100)';
  context.fillRect(0, 0, width, height);
  //Player
  context.fillStyle = 'white';
  context.fillRect(paddleBottomX, height - paddle_height - 10, paddle_width, paddle_height);
  //Computer
  context.fillRect(paddleTopX, 10, paddle_width, paddle_height);
  //Ball
  context.beginPath();
  context.arc(ballX, ballY, ball_radius, 2 * Math.PI, false);
  context.fillStyle = 'white';
  if (computerScore - playerScore == 1) context.fillStyle = 'yellow';
  else if (computerScore - playerScore > 1) context.fillStyle = 'red';
  context.fill();
  //centerLine
  context.beginPath();
  context.setLineDash([4]);
  context.moveTo(0, 350);
  context.lineTo(500, 350);
  context.strokeStyle = 'grey';
  context.stroke();
  //Current-scores
  context.font = '20px  Verdana, Geneva, Tahoma, sans-serif';
  context.fillStyle = 'white';
  context.fillText(computerScore, 20, 322);
  context.fillText(playerScore, 20, 390);

}
const ballReset = () => {
  ballX = 250;
  ballY = 350;
  speedY = 3;  //+ means down
  speedX = 3;  //+means right
  computerSpeed = 5.5;
  paddle_contact = false;
}
//Ball movement
const ballMove = () => {
  ballY += speedY;
  if (player_moved && paddle_contact) {
    ballX += speedX;
  }
}
//Boundary movements and contact movements
const checkBoundaries = () => {
  //left wall and right wall
  if ((ballX < 0 && speedX < 0) || (ballX > width && speedX > 0)) {
    speedX = -speedX;
  }
  //playerPaddle
  if (ballY > height - paddle_diff) {      //paddlediff=10+paddleheight+ballradius=25, therefore, at contact y position will be canvasheight-paddlediff.
    if (ballX > paddleBottomX && ballX < paddle_width + paddleBottomX) {
      paddle_contact = true;
      if (player_moved) {
        speedY += 0.5;
        if (speedY >= 10) {
          speedY = 10;
          computerSpeed = 10;
        }
      }
      speedY = -speedY;
      trajectoryX = ballX - (paddleBottomX + paddle_diff);
      speedX = trajectoryX * 0.3;
    }
    else if (ballY > height) {
      ballReset();
      computerScore++;
    }
  }
  //computer
  if (ballY < paddle_diff && speedY < 0) {
    if (paddleTopX < ballX && ballX < paddleTopX + paddle_width) {

      if (player_moved) {
        speedY -= 0.5;
        if (speedY <= -10) {
          speedY = -10;

        }
      }
      speedY = -speedY;
    }
    else if (ballY < 0) {
      ballReset();
      playerScore++;
    }
  }
}
//computer control.
const computer = () => {
  if (player_moved) {
    if (paddle_diff + paddleTopX < ballX) {
      paddleTopX += computerSpeed;
    } else {
      paddleTopX -= computerSpeed;
    }
  }
}


const gameOverPage = (winner) => {
  // const playAgain=document.createElement('div');
  canvas.hidden = true;
  playAgain.classList.add('play_again');
  playAgain.textContent = '';
  const title = document.createElement('h1');
  title.textContent = `${winner} Wins!`;
  const play_button = document.createElement('button');
  play_button.textContent = "Play Again!";
  play_button.setAttribute('onClick', 'gameStart()');
  playAgain.append(title, play_button);
  body.appendChild(playAgain);

}
const gameOver = () => {
  if (computerScore === winingScore || playerScore === winingScore) {
    isGameOver = true;

    let winner = computerScore === winingScore ? "Computer" : 'Player';
    gameOverPage(winner);
  }
}

//Updates every frame recursively. [Note: pauses on changing the tab but not in the case of setInterval()]
const callPaint = () => {
  renderCanvas();
  if (!isPaused) {
    ballMove();
    checkBoundaries();
    computer();
    gameOver();
  }
  if (!isGameOver) {
    requestAnimationFrame(callPaint);
  }
}
const gamePause = (event) => {
  if (event.key === 'Escape') {
    if (isPaused) isPaused = false;
    else isPaused = true;
  }
}
addEventListener('keyup', (e) => {
  gamePause(e);
  console.log("esc pressed");
});
const gameStart = () => {
  (!isNewGame && isGameOver) ? body.removeChild(playAgain) : null;

  canvas.hidden = false;
  playerScore = 0;
  computerScore = 0;
  isGameOver = false;
  isNewGame = false;
  isPaused = false;

  ballReset();
  createCanvas();
  callPaint();

  canvas.addEventListener('mousemove', (e) => {
    player_moved = true;
    paddleBottomX = e.clientX - canvasPosition - paddle_diff;
    console.log(e.clientX);
    console.log(paddleBottomX);
    if (paddleBottomX < 0) {  //:::|:::....
      paddleBottomX = 0;
    }
    if (paddleBottomX > width - paddle_width) {
      paddleBottomX = width - paddle_width; //...:::|:::
    }
    canvas.style.cursor = 'none';
  });
}
gameStart();


