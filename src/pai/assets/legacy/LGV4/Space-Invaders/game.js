const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ship = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 30,
    width: 30,
    height: 30,
    dx: 5
};

const base = {
    x: canvas.width / 2,
    y: canvas.height - 10,
    radius: 30
};

const bullets = [];
const invaders = [];
const rows = 3;
const cols = 10;

let paused = false;

function createInvaders() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            invaders.push({ x: 50 * c, y: 30 * r, width: 40, height: 20, dx: 1, dy: 0 });
        }
    }
}

function drawShip() {
    ctx.fillStyle = 'white';
    ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}

function drawBase() {
    ctx.beginPath();
    ctx.arc(base.x, base.y, base.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = 'blue'; 
    ctx.fill();
    ctx.closePath();
}

function drawBullets() {
    ctx.fillStyle = 'red';
    bullets.forEach((bullet, index) => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= bullet.dy;
        if (bullet.y < 0) bullets.splice(index, 1);
    });
}

function drawInvaders() {
    ctx.fillStyle = 'green';
    invaders.forEach((invader, index) => {
        ctx.fillRect(invader.x, invader.y, invader.width, invader.height);
        invader.x += invader.dx;
        if (invader.x + invader.width > canvas.width || invader.x < 0) {
            invader.dx *= -1;
            invader.y += 20;
        }
        if (invader.y > canvas.height) invaders.splice(index, 1);
    });

    if (invaders.length < rows * cols / 2) {
        createInvaders();
    }
}

function collisionDetection() {
    bullets.forEach((bullet, bIndex) => {
        invaders.forEach((invader, iIndex) => {
            if (bullet.x < invader.x + invader.width &&
                bullet.x + bullet.width > invader.x &&
                bullet.y < invader.y + invader.height &&
                bullet.y + bullet.height > invader.y) {
                invaders.splice(iIndex, 1);
                bullets.splice(bIndex, 1);
            }
        });
    });
}

function checkGameOver() {
    invaders.forEach(invader => {
        const distX = Math.abs(invader.x + invader.width / 2 - base.x);
        const distY = Math.abs(invader.y + invader.height / 2 - base.y);
        if (distX < base.radius && distY < base.radius) {
            invaders.length = 0;
            bullets.length = 0;
            createInvaders();
            alert('Game Over! The invaders have reached the base.');
        }
    });
}

function drawPauseScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText('Paused. Press / to continue.', canvas.width / 2 - 100, canvas.height / 2);
}

function update() {
    if (!paused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawShip();
        drawBase();
        drawBullets();
        drawInvaders();
        collisionDetection();
        checkGameOver();
    } else {
        drawPauseScreen();
    }
    requestAnimationFrame(update);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && ship.x + ship.width < canvas.width) {
        ship.x += ship.dx;
    }
    if (e.key === 'ArrowLeft' && ship.x > 0) {
        ship.x -= ship.dx;
    }
    if (e.code === 'Space') {
        bullets.push({ x: ship.x + ship.width / 2 - 2.5, y: ship.y, width: 5, height: 10, dy: 5 });
    }
    if (e.key === '/') {
        paused = !paused;
    }
});

createInvaders();
update();
