const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 50,
    y: 300,
    width: 40,
    height: 40,
    dx: 0,
    dy: 0,
    speed: 30,
    gravity: 0.1,
    jumpPower: -10,
    onGround: false
};

const keys = {
    right: false,
    left: false,
    up: false
};

let level = 0;
const levels = [];

function generateRandomLevel() {
    const numPlatforms = Math.floor(Math.random() * 5) + 3; // 3 to 7 platforms
    const platforms = [];

    for (let i = 0; i < numPlatforms; i++) {
        const width = Math.floor(Math.random() * 100) + 50;
        const height = 10;
        const x = Math.floor(Math.random() * (canvas.width - width));
        const y = Math.floor(Math.random() * (canvas.height - height));
        platforms.push({x, y, width, height});
    }

    // Add a spike randomly
    if (Math.random() > 1) {
        const spikeWidth = 10;
        const spikeHeight = 5;
        const spikeX = Math.floor(Math.random() * (canvas.width - spikeWidth));
        const spikeY = Math.floor(Math.random() * (canvas.height - spikeHeight));

        platforms.push({type: 'spike', x: spikeX, y: spikeY, width: spikeWidth, height: spikeHeight});
    }

    levels.push(platforms);
}

// Generate 3 random levels
for (let i = 0; i < 3; i++) {
    generateRandomLevel();
}

function drawPlayer() {
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    levels[level].forEach(platform => {
        if (platform.type === 'spike') {
            ctx.fillStyle = 'black';
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        } else {
            ctx.fillStyle = 'green';
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        }
    });
}

function updatePlayer() {
    if (keys.right) player.dx = player.speed;
    else if (keys.left) player.dx = -player.speed;
    else player.dx = 0;

    if (keys.up && player.onGround) {
        player.dy = player.jumpPower;
        player.onGround = false;
    }

    player.dy += player.gravity;
    player.x += player.dx;
    player.y += player.dy;

    player.onGround = false;

    checkCollisions();

    if (player.y + player.height > canvas.height) {
        player.dy = 0;
        player.onGround = true;
        player.y = canvas.height - player.height;
    }

    if (player.x > canvas.width) {
        player.x = 0;
        level = (level + 1) % levels.length; // Move to the next level
    }
}

function checkCollisions() {
    levels[level].forEach(platform => {
        if (platform.type !== 'spike' &&
            player.dy >= 0 &&
            player.y + player.height <= platform.y + player.dy &&
            player.y + player.height + player.dy >= platform.y &&
            player.x + player.width > platform.x &&
            player.x < platform.x + platform.width) {
            player.dy = 0;
            player.onGround = true;
            player.y = platform.y - player.height;
        }

        if (platform.type === 'spike' &&
            player.x + player.width > platform.x &&
            player.x < platform.x + platform.width &&
            player.y + player.height > platform.y &&
            player.y < platform.y + platform.height) {
            // Restart game if player touches a spike
            alert('You touched a spike! Restarting...');
            player.x = 50;
            player.y = 300;
            player.dx = 0;
            player.dy = 0;
            level = 0;
        }
    });
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
    clearCanvas();
    drawPlatforms();
    updatePlayer();
    drawPlayer();
    requestAnimationFrame(update);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') keys.right = true;
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowUp') keys.up = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight') keys.right = false;
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowUp') keys.up = false;
});

update();
