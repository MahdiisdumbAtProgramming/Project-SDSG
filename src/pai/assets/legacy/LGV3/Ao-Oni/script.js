const player = document.getElementById('player');
const oni = document.getElementById('oni');
const gameArea = document.getElementById('gameArea');
const backgroundMusic = document.getElementById('backgroundMusic');

let playerPosition = { x: 0, y: 0 };
let targetPosition = { x: 0, y: 0 };
let oniPosition = {
    x: Math.random() * (gameArea.clientWidth - 30),
    y: Math.random() * (gameArea.clientHeight - 30)
};
let keysCollected = 0;
const totalKeys = 10;
let keys = [];
const playerSpeed = 1;
const oniSpeed = 1;

// Function to create keys
function createKey() {
    const key = document.createElement('div');
    key.className = 'key';
    key.style.position = 'absolute';
    key.style.left = Math.random() * (gameArea.clientWidth - 20) + 'px';
    key.style.top = Math.random() * (gameArea.clientHeight - 20) + 'px';
    gameArea.appendChild(key);
    keys.push(key);
}

// Move the Oni towards the player
function moveOni() {
    const dx = playerPosition.x - oniPosition.x;
    const dy = playerPosition.y - oniPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 1) {
        oniPosition.x += (dx / distance) * oniSpeed;
        oniPosition.y += (dy / distance) * oniSpeed;
    }

    oni.style.left = oniPosition.x + 'px';
    oni.style.top = oniPosition.y + 'px';

    checkCollision();
}

// Check collision between player, Oni, and keys
function checkCollision() {
    const playerRect = player.getBoundingClientRect();
    const oniRect = oni.getBoundingClientRect();

    if (playerRect.left < oniRect.right &&
        playerRect.right > oniRect.left &&
        playerRect.top < oniRect.bottom &&
        playerRect.bottom > oniRect.top) {
        alert('Game Over! Restarting...');
        resetGame();
    }

    keys.forEach((key, index) => {
        const keyRect = key.getBoundingClientRect();
        if (playerRect.left < keyRect.right &&
            playerRect.right > keyRect.left &&
            playerRect.top < keyRect.bottom &&
            playerRect.bottom > keyRect.top) {
            keysCollected++;
            gameArea.removeChild(key);
            keys.splice(index, 1);
            if (keysCollected === totalKeys) {
                alert('You Win!');
                resetGame();
            }
        }
    });
}

// Reset the game state
function resetGame() {
    playerPosition = { x: 0, y: 0 };
    targetPosition = { x: 0, y: 0 };
    oniPosition = {
        x: Math.random() * (gameArea.clientWidth - 30),
        y: Math.random() * (gameArea.clientHeight - 30)
    };
    keysCollected = 0;
    keys.forEach(key => gameArea.removeChild(key));
    keys = [];
    for (let i = 0; i < totalKeys; i++) {
        createKey();
    }
}

// Track pressed keys for player movement
const keysPressed = {};

document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keysPressed[event.key] = false;
});

// Update player's target position
function updateTargetPosition() {
    if (keysPressed['ArrowUp'] && targetPosition.y > 0) {
        targetPosition.y -= playerSpeed;
    }
    if (keysPressed['ArrowDown'] && targetPosition.y < gameArea.clientHeight - 30) {
        targetPosition.y += playerSpeed;
    }
    if (keysPressed['ArrowLeft'] && targetPosition.x > 0) {
        targetPosition.x -= playerSpeed;
    }
    if (keysPressed['ArrowRight'] && targetPosition.x < gameArea.clientWidth - 30) {
        targetPosition.x += playerSpeed;
    }
}

// Smoothly update the player's position
function updatePlayerPosition() {
    const speed = 0.1;
    playerPosition.x += (targetPosition.x - playerPosition.x) * speed;
    playerPosition.y += (targetPosition.y - playerPosition.y) * speed;
    player.style.left = playerPosition.x + 'px';
    player.style.top = playerPosition.y + 'px';
}

// Main game loop
function gameLoop() {
    updateTargetPosition();
    moveOni();
    updatePlayerPosition();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
