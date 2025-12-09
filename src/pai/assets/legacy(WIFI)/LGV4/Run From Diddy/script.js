const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const player = document.createElement('div');
const chaser = document.getElementById('chaser');
const message = document.getElementById('message');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');

// Load high score from local storage, if available
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
highScoreElement.textContent = highScore;

// Canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(player);
player.id = 'player';

let playerX = 100;
let playerY = 100;
let chaserX = 300;
let chaserY = 300;
let speed = 2;

let score = 0;
let gameInterval;
let gameRunning = true;
let timeStart;

// Key states for smoother movement
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

const border = {
    x: canvas.width / 4,
    y: canvas.height / 4,
    width: canvas.width / 2,
    height: canvas.height / 2
};

function drawBorder() {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.strokeRect(border.x, border.y, border.width, border.height);
}

function updateChaserPosition() {
    let deltaX = playerX - chaserX;
    let deltaY = playerY - chaserY;
    let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Move the chaser towards the player, but keep it inside the border
    if (distance > 0) {
        chaserX += (deltaX / distance) * speed;
        chaserY += (deltaY / distance) * speed;

        // Ensure chaser stays within the border
        chaserX = Math.max(border.x, Math.min(border.x + border.width - 50, chaserX));
        chaserY = Math.max(border.y, Math.min(border.y + border.height - 50, chaserY));
    }

    chaser.style.left = `${chaserX}px`;
    chaser.style.top = `${chaserY}px`;
    
    checkCollision();
}

function updatePlayerPosition() {
    if (!gameRunning) return;

    // Smooth movement with key states, and ensure the player stays inside the border
    if (keys.ArrowUp && playerY > border.y) playerY -= 5;
    if (keys.ArrowDown && playerY < border.y + border.height - 40) playerY += 5;
    if (keys.ArrowLeft && playerX > border.x) playerX -= 5;
    if (keys.ArrowRight && playerX < border.x + border.width - 40) playerX += 5;

    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
}

function checkCollision() {
    const playerRect = player.getBoundingClientRect();
    const chaserRect = chaser.getBoundingClientRect();

    if (
        playerRect.x < chaserRect.x + chaserRect.width &&
        playerRect.x + playerRect.width > chaserRect.x &&
        playerRect.y < chaserRect.y + chaserRect.height &&
        playerRect.y + playerRect.height > chaserRect.y
    ) {
        // Collision detected, stop game and show message
        endGame();
    }
}

function updateScore() {
    let elapsedTime = (Date.now() - timeStart) / 1000; // in seconds
    score = Math.floor(elapsedTime);
    scoreElement.textContent = score;

    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;

        // Save high score to localStorage
        localStorage.setItem('highScore', highScore);
    }
}

function endGame() {
    clearInterval(gameInterval);
    message.textContent = "You got diddled!";
    message.style.display = "block";
    gameRunning = false;

    // Reset after 3 seconds
    setTimeout(resetGame, 3000);
}

function resetGame() {
    playerX = border.x + border.width / 2;
    playerY = border.y + border.height / 2;
    chaserX = border.x + Math.random() * (border.width - 50);
    chaserY = border.y + Math.random() * (border.height - 50);
    score = 0;
    scoreElement.textContent = score;
    message.style.display = "none";
    gameRunning = true;
    timeStart = Date.now();

    // Restart game loop
    gameInterval = setInterval(() => {
        updateChaserPosition();
        updateScore();
        updatePlayerPosition();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBorder();
    }, 1000 / 60);
}

document.addEventListener('keydown', (event) => {
    if (event.key in keys) {
        keys[event.key] = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key in keys) {
        keys[event.key] = false;
    }
});

// Start the game loop
resetGame();
