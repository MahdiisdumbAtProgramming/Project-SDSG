const player = document.getElementById('player');
const target = document.getElementById('target');
const scoreElement = document.getElementById('score');
const highscoreElement = document.getElementById('highscore');

const gameContainer = document.getElementById('game-container');
const containerWidth = gameContainer.offsetWidth;
const containerHeight = gameContainer.offsetHeight;

let score = 0;
let highscore = localStorage.getItem('highscore') || 0;
let playerSpeed = 4;
let targetSpeed = 4; // Fixed speed for the target

highscoreElement.textContent = highscore;

// Player starting position
let playerX = 100;
let playerY = 100;

// Target random position
let targetX = Math.random() * (containerWidth - 60);
let targetY = Math.random() * (containerHeight - 60);

// Target velocity
let targetVelocityX = targetSpeed * (Math.random() > 0.5 ? 1 : -1);
let targetVelocityY = targetSpeed * (Math.random() > 0.5 ? 1 : -1);

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// Movement detection for player
window.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});

// Move the target and keep it bouncing off walls
function moveTarget() {
    // Move target by its velocity
    targetX += targetVelocityX;
    targetY += targetVelocityY;

    // Bounce the target off the walls when it reaches the edges
    if (targetX <= 0 || targetX >= containerWidth - 60) {
        targetVelocityX *= -1; // Reverse X direction
        // Ensure it doesn't stick to the wall
        targetX = Math.max(0, Math.min(containerWidth - 60, targetX));
    }
    if (targetY <= 0 || targetY >= containerHeight - 60) {
        targetVelocityY *= -1; // Reverse Y direction
        // Ensure it doesn't stick to the wall
        targetY = Math.max(0, Math.min(containerHeight - 60, targetY));
    }

    // Ensure the target stays within the boundaries
    targetX = Math.max(0, Math.min(containerWidth - 60, targetX));
    targetY = Math.max(0, Math.min(containerHeight - 60, targetY));
}

function update() {
    // Player movement
    if (keys.ArrowUp && playerY > 0) playerY -= playerSpeed;
    if (keys.ArrowDown && playerY < containerHeight - 60) playerY += playerSpeed;
    if (keys.ArrowLeft && playerX > 0) playerX -= playerSpeed;
    if (keys.ArrowRight && playerX < containerWidth - 60) playerX += playerSpeed;

    // Apply movement to player
    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px';

    // Move target
    moveTarget();

    // Apply movement to target
    target.style.left = targetX + 'px';
    target.style.top = targetY + 'px';

    // Detect collision with the target (catch)
    if (Math.abs(playerX - targetX) < 60 && Math.abs(playerY - targetY) < 60) {
        score++;
        scoreElement.textContent = score;

        // Check high score
        if (score > highscore) {
            highscore = score;
            localStorage.setItem('highscore', highscore);
            highscoreElement.textContent = highscore;
        }

        // Move the target to a new random position when caught
        targetX = Math.random() * (containerWidth - 60);
        targetY = Math.random() * (containerHeight - 60);
        
        // Keep the target moving at the same speed
        targetVelocityX = targetSpeed * (Math.random() > 0.5 ? 1 : -1);
        targetVelocityY = targetSpeed * (Math.random() > 0.5 ? 1 : -1);
    }

    requestAnimationFrame(update);
}

update();
