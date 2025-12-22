const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player setup
const player = {
    x: 50,
    y: 300,
    width: 40,
    height: 40,
    dx: 0,
    dy: 0,
    speed: 2,
    gravity: 0.5,
    jumpPower: -10,
    onGround: false
};

// Keyboard input
const keys = { right: false, left: false, up: false };
let level = 0;

// Draw player
function drawPlayer() {
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw platforms and spikes
function drawPlatforms() {
    levels[level].forEach(p => {
        if (p.type === 'spike') {
            ctx.fillStyle = 'red';
        } else {
            ctx.fillStyle = 'black';
        }
        ctx.fillRect(p.x, p.y, p.width, p.height);
    });
}

// Update player position
function updatePlayer() {
    // Horizontal movement
    player.dx = 0;
    if (keys.right) player.dx = player.speed;
    if (keys.left) player.dx = -player.speed;
    player.x += player.dx;

    // Jump
    if (keys.up && player.onGround) {
        player.dy = player.jumpPower;
        player.onGround = false; // now the player leaves the ground
    }

    // Apply gravity
    player.dy += player.gravity;

    // Predict next vertical position
    const nextY = player.y + player.dy;

    let landed = false;

    levels[level].forEach(p => {
        if (!p.type) {
            const playerLeft = player.x;
            const playerRight = player.x + player.width;
            const playerBottomNext = nextY + player.height;

            const platformLeft = p.x;
            const platformRight = p.x + p.width;
            const platformTop = p.y;

            // Horizontal overlap
            if (playerRight > platformLeft && playerLeft < platformRight) {
                // Check if player would land on this platform
                if (player.y + player.height <= platformTop && playerBottomNext >= platformTop) {
                    player.dy = platformTop - player.y - player.height;
                    landed = true;
                }
            }
        }

        // Spike collision
        if (p.type) {
            const playerLeft = player.x;
            const playerRight = player.x + player.width;
            const playerTop = player.y;
            const playerBottom = player.y + player.height;

            const spikeLeft = p.x;
            const spikeRight = p.x + p.width;
            const spikeTop = p.y;
            const spikeBottom = p.y + p.height;

            if (playerRight > spikeLeft && playerLeft < spikeRight &&
                playerBottom > spikeTop && playerTop < spikeBottom) {
                resetPlayer();
            }
        }
    });

    // Move player
    player.y += player.dy;

    // Check if landed
    player.onGround = landed;

    // Floor clamp
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.onGround = true;
    }

    // Level transition
    if (player.x > canvas.width) {
        player.x = 0;
        level = (level + 1) % levels.length;
    } else if (player.x < 0) {
        player.x = canvas.width - player.width;
        level = (level - 1 + levels.length) % levels.length;
    }
}


// Collision detection
function checkCollisions() {
    player.onGround = false; // reset

    levels[level].forEach(p => {
        if (!p.type) {
            // Compute next position
            const nextY = player.y + player.dy;
            const nextBottom = nextY + player.height;

            const platformTop = p.y;
            const platformBottom = p.y + p.height;

            const playerLeft = player.x;
            const playerRight = player.x + player.width;
            const platformLeft = p.x;
            const platformRight = p.x + p.width;

            // Check horizontal overlap
            const horizontalOverlap = playerRight > platformLeft && playerLeft < platformRight;

            // Check vertical collision from above
            if (horizontalOverlap && player.y + player.height <= platformTop && nextBottom >= platformTop) {
                player.dy = 0;
                player.y = platformTop - player.height;
                player.onGround = true;
            }
        }

        // Spike collision
        if (p.type === 'spike') {
            const playerLeft = player.x;
            const playerRight = player.x + player.width;
            const playerTop = player.y;
            const playerBottom = player.y + player.height;

            const spikeLeft = p.x;
            const spikeRight = p.x + p.width;
            const spikeTop = p.y;
            const spikeBottom = p.y + p.height;

            if (playerRight > spikeLeft && playerLeft < spikeRight &&
                playerBottom > spikeTop && playerTop < spikeBottom) {
                resetPlayer();
            }
        }
    });

    // Floor clamp
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.onGround = true;
    }
}




// Reset player on spike
function resetPlayer() {
    player.x = 50;
    player.y = 300;
    player.dx = 0;
    player.dy = 0;
    level = 0;
}

// Clear canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Game loop
function update() {
    clearCanvas();
    drawPlatforms();
    updatePlayer();
    drawPlayer();
    requestAnimationFrame(update);
}

// Keyboard listeners
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') keys.right = true;
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowUp') keys.up = true;
});
document.addEventListener('keyup', e => {
    if (e.key === 'ArrowRight') keys.right = false;
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowUp') keys.up = false;
});

// Start game
update();