const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set the player positions to start at the bottom of the canvas
const players = [
    { x: 50, y: canvas.height - 60, width: 40, height: 40, speed: 5, bullets: [], alive: true, invincible: false, invincibleTime: 0, color: 'red', controls: { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', shoot: ' ' }, score: 0 },
    { x: 100, y: canvas.height - 60, width: 40, height: 40, speed: 5, bullets: [], alive: true, invincible: false, invincibleTime: 0, color: 'blue', controls: { up: 'w', down: 's', left: 'a', right: 'd', shoot: ' ' }, score: 0 }
];

const keys = {};
const enemies = [];
let totalScore = 0;  // Total score for both players
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0; // Retrieve high score from local storage
let paused = false;

function drawPlayer(player) {
    ctx.fillStyle = player.invincible ? 'rgba(255, 255, 255, 0.5)' : player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Display player score
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${player.score}`, player.x, player.y - 10);
}

function drawHighScore() {
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, 30); // Display high score at the top center
}

function drawBullets(player) {
    player.bullets.forEach((bullet, bIndex) => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= bullet.speed;

        // Check collision with enemies
        enemies.forEach((enemy, eIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                // Remove enemy and bullet on collision
                enemies.splice(eIndex, 1);
                player.bullets.splice(bIndex, 1);
                // Increment player's score
                player.score++;
                totalScore++; // Increment total score

                // Check for new high score
                if (totalScore > highScore) {
                    highScore = totalScore;
                    localStorage.setItem('highScore', highScore); // Save new high score
                }
            }
        });

        if (bullet.y < 0) player.bullets.splice(bIndex, 1);
    });
}

function drawEnemies() {
    ctx.fillStyle = 'green';
    enemies.forEach((enemy, index) => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        moveEnemy(enemy); // Target nearest alive player
        checkCollisionWithPlayers(enemy, index);
    });
}

function moveEnemy(enemy) {
    const alivePlayers = players.filter(player => player.alive);  // Filter only alive players
    if (alivePlayers.length === 0) return; // If no players are alive, do nothing

    // Find the nearest alive player
    let closestPlayer = null;
    let minDistance = Infinity;
    
    alivePlayers.forEach(player => {
        const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (distance < minDistance) {
            minDistance = distance;
            closestPlayer = player;
        }
    });

    if (closestPlayer) {
        const angle = Math.atan2(closestPlayer.y - enemy.y, closestPlayer.x - enemy.x);
        enemy.x += enemy.speed * Math.cos(angle);
        enemy.y += enemy.speed * Math.sin(angle);
    }
}

function checkCollisionWithPlayers(enemy, enemyIndex) {
    players.forEach((player, playerIndex) => {
        if (player.alive && !player.invincible &&
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            // Player dies
            player.alive = false;
            player.color = 'pink';  // Turn pink when dead
        }
    });
}

function movePlayer(player) {
    if (!player.alive) return;  // Dead players can't move

    if (keys[player.controls.up] && player.y > 0) player.y -= player.speed;
    if (keys[player.controls.down] && player.y + player.height < canvas.height) player.y += player.speed;
    if (keys[player.controls.left] && player.x > 0) player.x -= player.speed;
    if (keys[player.controls.right] && player.x + player.width < canvas.width) player.x += player.speed;
}

function shoot(player) {
    if (!player.alive || player.bullets.length > 5) return;  // Can't shoot while dead or limit bullets
    player.bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 10, speed: 7 });
}

function checkPlayerRevival() {
    players.forEach((player, index) => {
        if (!player.alive) {
            const otherPlayer = players[1 - index];
            if (otherPlayer.alive && // Check if the other player is alive and touching the dead player
                otherPlayer.x < player.x + player.width &&
                otherPlayer.x + otherPlayer.width > player.x &&
                otherPlayer.y < player.y + player.height &&
                otherPlayer.y + otherPlayer.height > player.y) {
                // Revive the dead player
                player.alive = true;
                player.invincible = true;
                player.invincibleTime = 5000;
                player.color = index === 0 ? 'red' : 'blue';  // Restore original color
            }
        }
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update players' invincibility timers
    players.forEach(player => {
        if (player.invincible) {
            player.invincibleTime -= 16;
            if (player.invincibleTime <= 0) {
                player.invincible = false;
            }
        }
    });

    // Draw players in the proper order to avoid layering issues
    players.forEach(drawPlayer);
    drawHighScore();  // Draw the high score at the top

    // Draw bullets and enemies
    players.forEach(player => drawBullets(player));
    drawEnemies();

    // Move players
    players.forEach(movePlayer);

    // Check for player revival
    checkPlayerRevival();

    requestAnimationFrame(update);
}

// Keydown event
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    players.forEach((player, index) => {
        if (e.key === player.controls.shoot) {
            shoot(player);
        }
    });
});

// Keyup event
document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Slow down enemies by reducing speed
setInterval(() => {
    const enemyWidth = 40;
    const enemyHeight = 40;
    const x = Math.random() * (canvas.width - enemyWidth);
    const speed = Math.random() * 1.5 + 0.5;  // Slower enemies
    enemies.push({ x, y: 0, width: enemyWidth, height: enemyHeight, speed });
}, 1000);

update();
