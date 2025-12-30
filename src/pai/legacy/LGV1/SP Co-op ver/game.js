const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 400;

// Players
const player1 = { x: 50, y: canvas.height - 30, width: 20, height: 20, color: 'red', bullets: [], score: 0 };
const player2 = { x: 520, y: canvas.height - 30, width: 20, height: 20, color: 'blue', bullets: [], score: 0 };

// Aliens
const aliens = [];
const alienRows = 5;
const alienCols = 10;
const alienWidth = 30;
const alienHeight = 20;
const alienSpeed = 0.2; // Speed at which aliens move down (very slow)
const spawnThreshold = 5; // Number of aliens destroyed before respawning more
let aliensDestroyed = 0;

// Base
const base = { x: canvas.width / 2 - 20, y: canvas.height - 60, radius: 20 };
let baseHealth = 2; // Health of the base

// High Score
let highScore = 0;

// Create aliens
function createAliens() {
    for (let r = 0; r < alienRows; r++) {
        for (let c = 0; c < alienCols; c++) {
            aliens.push({ x: c * (alienWidth + 10), y: r * (alienHeight + 10), width: alienWidth, height: alienHeight });
        }
    }
}

// Draw functions
function drawPlayer(player) {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawAliens() {
    ctx.fillStyle = 'green';
    aliens.forEach(alien => {
        ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
    });
}

function drawBullets(bullets) {
    ctx.fillStyle = 'yellow';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, 5, 10);
    });
}

function drawBase() {
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(base.x + base.radius, base.y + base.radius, base.radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawScores() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Player 1 Score: ${player1.score}`, 20, 30);
    ctx.fillText(`Player 2 Score: ${player2.score}`, 400, 30);
    ctx.fillText(`High Score: ${highScore}`, canvas.width / 2 - 50, 30);
}

function moveBullets(bullets) {
    bullets.forEach(bullet => {
        bullet.y -= 5; // Move the bullet up
    });
}

function moveAliens() {
    aliens.forEach(alien => {
        alien.y += alienSpeed; // Move each alien down
    });
}

// Move aliens left and right, and make them go down when hitting the wall
function moveAliensWithWallCollision() {
    let moveDirection = 1; // 1 for right, -1 for left
    const alienSpeedHorizontal = 0.5; // Horizontal speed of aliens

    aliens.forEach(alien => {
        alien.x += moveDirection * alienSpeedHorizontal; // Move aliens horizontally

        // Check for wall collision
        if (alien.x + alien.width > canvas.width || alien.x < 0) {
            moveDirection *= -1; // Change direction
            alien.y += 1; // Move down by 1 pixel
        }
    });
}

function checkCollision() {
    // Check if any alien touches the base
    for (const alien of aliens) {
        if (alien.y + alien.height >= base.y && 
            alien.x + alien.width >= base.x && 
            alien.x <= base.x + base.radius * 2) {
            
            baseHealth -= 1; // Reduce base health by 1
            // Remove the alien that touched the base
            const alienIndex = aliens.indexOf(alien);
            aliens.splice(alienIndex, 1);
            
            if (baseHealth < 0) {
                baseHealth = 0; // Prevent negative health
            }
            return; // Only check for one collision at a time
        }
    }

    // Check for bullet collisions with aliens
    player1.bullets.forEach(bullet => {
        aliens.forEach(alien => {
            if (bullet.y <= alien.y + alien.height && 
                bullet.x + 5 >= alien.x && 
                bullet.x <= alien.x + alien.width) {
                // Remove bullet and alien on hit
                const bulletIndex = player1.bullets.indexOf(bullet);
                player1.bullets.splice(bulletIndex, 1);
                
                const alienIndex = aliens.indexOf(alien);
                aliens.splice(alienIndex, 1);
                
                // Increase player 1 score
                player1.score += 10; // Award 10 points for each alien
                aliensDestroyed += 1; // Increase the destroyed aliens count

                // Respawn aliens if enough have been destroyed
                if (aliensDestroyed % spawnThreshold === 0) {
                    spawnAliens();
                }
            }
        });
    });

    player2.bullets.forEach(bullet => {
        aliens.forEach(alien => {
            if (bullet.y <= alien.y + alien.height && 
                bullet.x + 5 >= alien.x && 
                bullet.x <= alien.x + alien.width) {
                // Remove bullet and alien on hit
                const bulletIndex = player2.bullets.indexOf(bullet);
                player2.bullets.splice(bulletIndex, 1);
                
                const alienIndex = aliens.indexOf(alien);
                aliens.splice(alienIndex, 1);
                
                // Increase player 2 score
                player2.score += 10; // Award 10 points for each alien
                aliensDestroyed += 1; // Increase the destroyed aliens count

                // Respawn aliens if enough have been destroyed
                if (aliensDestroyed % spawnThreshold === 0) {
                    spawnAliens();
                }
            }
        });
    });
}

// Function to spawn new aliens
function spawnAliens() {
    const newRows = Math.floor(Math.random() * 3) + 1; // Random new rows
    for (let r = 0; r < newRows; r++) {
        for (let c = 0; c < alienCols; c++) {
            aliens.push({ x: c * (alienWidth + 10), y: 0, width: alienWidth, height: alienHeight });
        }
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveAliensWithWallCollision(); // Move aliens with wall collision handling
    drawAliens();
    drawPlayer(player1);
    drawPlayer(player2);
    moveBullets(player1.bullets);
    moveBullets(player2.bullets);
    drawBullets(player1.bullets);
    drawBullets(player2.bullets);
    drawBase();
    drawScores(); // Draw scores
    checkCollision(); // Check for collisions

    // Display Game Over message if base health is 0
    if (baseHealth === 0) {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over!', canvas.width / 2 - 70, canvas.height / 2);
        // Update high score
        highScore = Math.max(highScore, player1.score, player2.score);
    }

    requestAnimationFrame(update);
}

// Start with initial aliens
createAliens();

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        // Player 1 controls
        case 'ArrowLeft':
            player1.x = Math.max(0, player1.x - 10); // Move left
            break;
        case 'ArrowRight':
            player1.x = Math.min(canvas.width - player1.width, player1.x + 10); // Move right
            break;
        case 'Enter': // Shoot for Player 1
            if (player1.bullets.length < 3) {
                player1.bullets.push({ x: player1.x + 7.5, y: player1.y });
            }
            break;

        // Player 2 controls
        case 'a':
            player2.x = Math.max(0, player2.x - 10); // Move left
            break;
        case 'd':
            player2.x = Math.min(canvas.width - player2.width, player2.x + 10); // Move right
            break;
        case ' ': // Shoot for Player 2
            if (player2.bullets.length < 3) {
                player2.bullets.push({ x: player2.x + 7.5, y: player2.y });
            }
            break;
    }
});

update();
