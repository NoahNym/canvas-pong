import { handleCollision, handleRectangleCircleCollision } from './physics';
import './style.css';

type ball = {
  radius: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
};

export type player = {
  width: number;
  height: number;
  x: number;
  y: number;
  speed: number;
  color: string;
};

const canvas = document.createElement('canvas');
canvas.width = 1200;
canvas.height = 600;
const context = canvas.getContext('2d')!;
document.querySelector('#app')!.append(canvas);

const balls: ball[] = [
  {
    radius: 20,
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 110,
    vy: 0,
    fillColor: 'purple',
    strokeColor: 'black',
    strokeWidth: 0,
  },
];

const player1: player = {
  width: 10,
  height: 100,
  x: 30,
  y: canvas.height / 2 - 50,
  speed: 5,
  color: 'blue',
};

const player2: player = {
  ...player1,
  x: canvas.width - 30,
  color: 'red',
};

let isPlayer1MovingUp = false;
let isPlayer1MovingDown = false;
let isPlayer2MovingUp = false;
let isPlayer2MovingDown = false;

let isGameRunning = false;
let gameLoopRunning = false;



document.addEventListener('keydown', (event) => {
  if (event.key === 'w') {
    isPlayer1MovingUp = true;
  } else if (event.key === 's') {
    isPlayer1MovingDown = true;
  }
  if (event.key === 'ArrowUp') {
    isPlayer2MovingUp = true;
  } else if (event.key === 'ArrowDown') {
    isPlayer2MovingDown = true;
  }
  if (event.key === ' ' && !gameLoopRunning) {
    restartGame(); // Restart the game on spacebar press
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'w') {
    isPlayer1MovingUp = false;
  } else if (event.key === 's') {
    isPlayer1MovingDown = false;
  }
  if (event.key === 'ArrowUp') {
    isPlayer2MovingUp = false;
  } else if (event.key === 'ArrowDown') {
    isPlayer2MovingDown = false;
  }
});

function restartGame() {
  isGameRunning = true;
  gameLoopRunning = true;

  balls[0].x = canvas.width / 2;
  balls[0].y = canvas.height / 2;
  const speed = 10;

  player1.y = canvas.height / 2 - 50
  player2.y = canvas.height / 2 - 50

  // Generate random angles for vx and vy separately within the specified range
  const minAngle = (50 * Math.PI) / 180;
  const maxAngle = (230 * Math.PI) / 180;

  // Generate random angles for vx and vy separately
  const randomAngleVx = minAngle + Math.random() * (maxAngle - minAngle); // Random angle for vx
  const randomAngleVy = minAngle + Math.random() * (maxAngle - minAngle); // Random angle for vy

  // Calculate vx and vy using normalized vector
  const normalizedVx = Math.cos(randomAngleVx);
  const normalizedVy = Math.sin(randomAngleVy);

  // Normalize the velocity vector to maintain a consistent speed
  const length = Math.sqrt(normalizedVx * normalizedVx + normalizedVy * normalizedVy);
  balls[0].vx = (normalizedVx / length) * speed;
  balls[0].vy = (normalizedVy / length) * speed;

  requestAnimationFrame(gameloop);
}





let player1score = 0;
let player2score = 0;

function player1Score() {
  player1score++;
  console.log('Player 1 has scored ' + player1score + ' times');
  isGameRunning = false; // Pause the game when someone scores
}

function player2Score() {
  player2score++;
  console.log('Player 2 has scored ' + player2score + ' times');
  isGameRunning = false; // Pause the game when someone scores
}

function gameloop() {
  if (!isGameRunning) {
    gameLoopRunning = false; // Set the flag to indicate that the game loop has stopped
    return; // Stop the animation loop if the game is paused
  }

  requestAnimationFrame(gameloop);
  update();
  render();
}

function update() {
  for (let i = 0; i < balls.length; i++) {
    let ball = balls[i];

    ball.x += ball.vx;
    ball.y += ball.vy;

    for (const playerObj of [player1, player2]) {
      handleRectangleCircleCollision(playerObj, ball);
    }
    for (let j = i + 1; j < balls.length; j++) {
      handleCollision(ball, balls[j]);
    }
    // right edge
    if (ball.x + ball.radius >= canvas.width) {
      ball.vx = -ball.vx;
      ball.x = canvas.width - ball.radius;
      player1Score();

    }
    // left edge
    if (ball.x - ball.radius < 0) {
      ball.vx = -ball.vx;
      ball.x = ball.radius;
      player2Score();
    }
    // bottom edge
    if (ball.y + ball.radius >= canvas.height) {
      ball.vy = -ball.vy;
      ball.y = canvas.height - ball.radius;
    }
    // top edge
    if (ball.y - ball.radius < 0) {
      ball.vy = -ball.vy;
      ball.y = ball.radius;
    }

    for (let j = i + 1; j < balls.length; j++) {
      handleCollision(ball, balls[j]);
    }
    if (isPlayer1MovingUp && player1.y > 0) {
      player1.y -= player1.speed;
    } else if (isPlayer1MovingDown && player1.y + player1.height < canvas.height) {
      player1.y += player1.speed;
    }
    if (isPlayer2MovingUp && player2.y > 0) {
      player2.y -= player2.speed;
    } else if (isPlayer2MovingDown && player2.y + player2.height < canvas.height) {
      player2.y += player2.speed;
    }
  }
}

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  renderScores();  // Add this line to render the scores

  for (const ball of balls) {
    drawCircle(ball.x, ball.y, ball.radius, ball.fillColor, ball.strokeColor, 8);
  }

  drawPlayer(player1);
  drawPlayer(player2);

  if (!isGameRunning) {
    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.textAlign = 'center';
    context.fillText('Press Space to restart', canvas.width / 2, canvas.height / 2);
  }
}


function renderScores() {
  context.fillStyle = 'black';
  context.font = '24px Arial';
  context.textAlign = 'center';
  context.fillText('' + player1score, 100, 50);
  context.fillText('' + player2score, canvas.width - 100, 50);
}




function drawPlayer(player: player) {
  context.fillStyle = player.color;
  context.fillRect(player.x, player.y, player.width, player.height);
}

function drawCircle(x: number, y: number, radius: number, fillColor: string, strokeColor: string, strokeWidth: number) {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);

  context.fillStyle = fillColor;
  context.fill();

  context.lineWidth = strokeWidth;
  context.strokeStyle = strokeColor;
  context.stroke();
}