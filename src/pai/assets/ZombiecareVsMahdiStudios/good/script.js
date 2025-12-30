window.addEventListener('DOMContentLoaded', () => {
  // Canvas setup
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  // UI Elements
  const enemyHealthBar = document.getElementById('enemyHealthBar');
  const bgMusic = document.getElementById('bgMusic');
  const enemyImage = document.getElementById('enemyImage');
  const phaseCounter = document.getElementById('phaseCounter');

  // Game state
  let gameStarted = false;
  let player = null;
  let selectedCharacter = null;
let mohamadBulletCount = 0; // For Mohamad's bullet count
  const bullets = [];
  const enemyBullets = [];
  const keys = {};
let currentPhase = null;
  let lastShotTime = 0;
  const shotCooldown = 1000; // ms
let spaceKeyDown = false; // To prevent multiple toggles from a single press

  const phaseHealths = { 1: 300, 2: 600, 3: 900, 4: 1200 };

  const enemy = {
    x: 400,
    y: 150,
    size: 50,
    health: 300,
    maxHealth: 300,
    speed: 1.5,
    lockOnActive: false,
    lockOnEndTime: 0,
    rushing: false,
    rushTargetX: 0,
    rushTargetY: 0,
    circleAttackCooldown: 0,
    circleAttackActive: false,
    rushStartTime: 0
  };

  const characters = {
  Mahdi: { name: 'Mahdi', color: 'green', size: 20, speed: 4, maxHealth: 1, bulletsFired: 0 },
  Luke: { name: 'Luke', color: 'pink', size: 20, speed: 4, maxHealth: 1, shotsFired: 0 },
  Jason: { name: 'Jason', color: 'blue', size: 20, speed: 4, maxHealth: 1, damage: 1 },
  Jacob: { name: 'Jacob', color: 'red', size: 20, speed: 4, maxHealth: 1, damage: 5, damageChangeInterval: 9000, currentDamage: 5 },
  Ibraheem: { name: 'Ibraheem', color: 'orange', size: 20, speed: 4, maxHealth: 1 },
  Christopher: { name: 'Christopher', color: 'yellow', size: 20, speed: 4, maxHealth: 1, shotsCount: 0 },
  CJ: { name: 'CJ', color: 'lime', size: 20, speed: 4, maxHealth: 1, bulletsFired: 0 },
  Alex: { name: 'Alex', color: 'grey', size: 20, speed: 4, maxHealth: 1, damageMultiplier: 1.5, bulletsFired: 0 },
  Andrew: { name: 'Andrew', color: 'purple', size: 20, speed: 4, maxHealth: 1, bulletsFired: 0 },
      Null: { name: 'Null', color: 'white', size: 10, speed: 5, maxHealth: 1 },
  Mohamad: { name: 'Mohamad', color: 'cyan', size: 20, speed: 4, maxHealth: 1 }
};

    function shoot() {
        if (!player || player.health <= 0 || enemy.health <= 0) return;

        let damage = 1;

        switch (player.name) {
            case 'Mahdi':
                player.bulletsFired = (player.bulletsFired || 0) + 1;
                if (player.bulletsFired % 5 === 0) damage = 10;
                break;

            case 'Luke':
                damage = 1;
                break;

            case 'Jason':
                damage = 1 + Math.random() * 9;
                break;

            case 'Jacob':
                damage = 5 + Math.floor(Math.random() * 20);
                player.fullShotsFired = (player.fullShotsFired || 0) + 1;
                break;

            case 'Ibraheem':
                damage = 1;
                break;

            case 'Christopher':
                player.shotsCount = (player.shotsCount || 0) + 1;
                if (player.shotsCount % 3 === 0) damage = 1 + Math.random() * 50;
                break;

            case 'CJ':
                player.bulletsFired = (player.bulletsFired || 0) + 1;
                damage = Math.min(player.bulletsFired, 10); // Example pattern
                break;

            case 'Alex':
                damage = 1.5;
                break;

            case 'Andrew':
                player.bulletsFired = (player.bulletsFired || 0) + 1;
                if (player.bulletsFired % 5 === 0) damage = 10;
                break;

            case 'Null':
                const angleToEnemy = Math.atan2(enemy.y - player.y, enemy.x - player.x);
                const numBullets = 8;       // Number of bullets fired at once
                const bulletSpeed = 10;     // Speed of bullets
                const nullDamage = 50;      // Damage per bullet

                for (let i = 0; i < numBullets; i++) {
                    bullets.push({
                        x: player.x,
                        y: player.y,
                        vx: Math.cos(angleToEnemy) * bulletSpeed,
                        vy: Math.sin(angleToEnemy) * bulletSpeed,
                        size: 5,
                        damage: nullDamage
                    });
                }
                return; // exit after firing Null
        }

        // Apply Alex damage multiplier
        if (player.name === 'Alex') {
            damage *= player.damageMultiplier;
        }

        // Calculate angle for normal single bullets
        const angle = Math.atan2(enemy.y - player.y, enemy.x - player.x);
        const vx = Math.cos(angle) * 8;
        const vy = Math.sin(angle) * 8;

        // Luke spread shot
        if (player.name === 'Luke' && damage === 1) {
            for (let i = 0; i < 5; i++) {
                const spreadAngle = angle + (Math.random() - 0.5) * 0.2;
                bullets.push({
                    x: player.x,
                    y: player.y,
                    vx: Math.cos(spreadAngle) * 8,
                    vy: Math.sin(spreadAngle) * 8,
                    size: 5,
                    damage: 2
                });
            }
            return;
        }

        // Alex spread shot for normal shots
        if (player.name === 'Alex' && damage === 1.5) {
            for (let i = 0; i < 5; i++) {
                const spreadAngle = angle + (Math.random() - 0.5) * 0.2;
                bullets.push({
                    x: player.x,
                    y: player.y,
                    vx: Math.cos(spreadAngle) * 8,
                    vy: Math.sin(spreadAngle) * 8,
                    size: 5,
                    damage: 1.5
                });
            }
            return;
        }

        // Default single bullet
        bullets.push({ x: player.x, y: player.y, vx, vy, size: 5, damage });
    }

  // Luke auto-shoot toggle
  let isLukeAutoShooting = false;
  let lukeIntervalId = null;

  // Character selection event
  document.querySelectorAll('.char-btn').forEach(btn => {
    btn.onclick = () => {
      selectedCharacter = btn.dataset.char;
      document.getElementById('characterSelection').style.display = 'none';
      startGame();
    };
  });
  function startGame() {
    if (bgMusic) bgMusic.play();
    document.getElementById('gameInfo').style.display = 'none';
  
    // Reset health bars
    document.getElementById('healthBar').style.width = '100%';
    document.getElementById('enemyHealthBar').style.width = '100%';
  
    // Assign player once, do NOT reassign during game loop!
    player = Object.assign({}, characters[selectedCharacter]);
  
    // Initialize player stats
    player.health = player.maxHealth;
    player.x = canvas.width / 2;
    player.y = canvas.height - 50;
    player.shotsCount = 0;
    player.bulletsFired = 0;
    player.damage = 1;
  
    // Stop Luke auto-shoot if active
    stopLukeAutoShoot();
  
    // Reset enemy for phase 1
    currentPhase = 1;
    setupPhase();
    if (!gameStarted) {
      gameStarted = true;
      requestAnimationFrame(update);
    }
  }
  
  function setupPhase() {
    // Reset enemy stats for the current phase
    enemy.health = phaseHealths[currentPhase];
    enemy.maxHealth = phaseHealths[currentPhase];
    enemy.x = 400;
    enemy.y = 150;
    enemy.lockOnActive = false;
    enemy.rushing = false;
    enemy.circleAttackCooldown = 0;
    enemy.circleAttackActive = false;
  
    // Update phase counter
    updatePhaseCounter();
  }
  
  function nextPhase() {
    currentPhase++;
    if (currentPhase > Object.keys(phaseHealths).length) {
      // End the game if all phases are completed
      return;
    }
    setupPhase();
  }
    // Konami Code sequence: up, up, down, down, left, right, left, right, b, a
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];
    let konamiIndex = 0;

    window.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                konamiIndex = 0;
                // Unlock Null
                const nullButton = document.querySelector('.char-btn[data-char="Null"]');
                if (nullButton) nullButton.style.display = 'inline-block';
                alert('Secret character Null unlocked!');
            }
        } else {
            konamiIndex = 0; // reset if wrong key
        }
    });

  function update() {
    if (!gameStarted) return;
    // --- Keep movement updates only --- //
    if (player) {
      if (keys['ArrowUp']) player.y -= player.speed;
      if (keys['ArrowDown']) player.y += player.speed;
      if (keys['ArrowLeft']) player.x -= player.speed;
      if (keys['ArrowRight']) player.x += player.speed;
  
      // Keep within bounds
      player.x = Math.max(0, Math.min(canvas.width, player.x));
      player.y = Math.max(0, Math.min(canvas.height, player.y));
    }
  
    handleEnemyBehavior();
    handleBullets();
    checkCollision();
    handlePeriodicEffects();
    handleEnemyAttack();
  
    if (enemy.health <= 0) {
      nextPhase(); // Transition to the next phase
      return;
    }
    if (player && player.health <= 0) {
      setTimeout(() => location.reload(), 1500);
      return;
    }
  
    updateHealthBar();
    updateEnemyHealthBar();
    draw();
  
    requestAnimationFrame(update);
  }
  function stopLukeAutoShoot() {
    if (lukeIntervalId) {
      clearInterval(lukeIntervalId);
      lukeIntervalId = null;
    }
    isLukeAutoShooting = false;
  }
  // Input event handlers
  window.addEventListener('keydown', e => {
    keys[e.key] = true;
  
    if (e.key === ' ') {
      if (selectedCharacter === 'Luke') {
        if (!spaceKeyDown) {
          spaceKeyDown = true; // Mark as pressed
          // Toggle auto-shoot
          if (!isLukeAutoShooting) {
            // Turn on auto-shoot
            isLukeAutoShooting = true;
            lukeIntervalId = setInterval(() => {
              shoot();
            }, 1000);
          } else {
            // Turn off auto-shoot
            clearInterval(lukeIntervalId);
            lukeIntervalId = null;
            isLukeAutoShooting = false;
          }
        }
      } else {
        // For other characters, shoot normally
        if (player && (Date.now() - lastShotTime >= shotCooldown)) {
          shoot();
          lastShotTime = Date.now();
        }
      }
    }
  });

  window.addEventListener('keyup', e => {
    keys[e.key] = false;
    if (e.key === ' ' && selectedCharacter === 'Luke') {
      spaceKeyDown = false; // Reset toggle lock
    }
  });

  function update() {
    if (!gameStarted) return;

    // --- Keep movement updates only --- //
    if (player) {
      if (keys['ArrowUp']) player.y -= player.speed;
      if (keys['ArrowDown']) player.y += player.speed;
      if (keys['ArrowLeft']) player.x -= player.speed;
      if (keys['ArrowRight']) player.x += player.speed;
      // Keep within bounds
      player.x = Math.max(0, Math.min(canvas.width, player.x));
      player.y = Math.max(0, Math.min(canvas.height, player.y));
    }

    handleEnemyBehavior();
    handleBullets();
    checkCollision();
    handlePeriodicEffects();
    handleEnemyAttack();

    if (enemy.health <= 0) {
        nextPhase();
      return;
    }
    if (player && player.health <= 0) {
      alert('You died! Reloading...');
      setTimeout(() => location.reload(), 1500);
      return;
    }

    updateHealthBar();
    updateEnemyHealthBar();
    draw();

    requestAnimationFrame(update);
  }

  // Enemy behavior functions (unchanged, included for completeness)
  function handleEnemyBehavior() {
    if (enemy.health <= 0) return;

    if (enemy.rushing) {
      if (Date.now() - enemy.rushStartTime > 5000) {
        enemy.rushing = false;
      } else {
        const dx = enemy.rushTargetX - enemy.x;
        const dy = enemy.rushTargetY - enemy.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 1) {
          const rushSpeed = 10;
          enemy.x += (dx / dist) * rushSpeed;
          enemy.y += (dy / dist) * rushSpeed;
        }
        if (dist < enemy.speed || Math.hypot(player.x - enemy.x, player.y - enemy.y) < player.size + enemy.size) {
          enemy.rushing = false;
        }
      }
    } else if (enemy.lockOnActive) {
      if (Date.now() > enemy.lockOnEndTime) {
        enemy.lockOnActive = false;
      } else {
        if (!enemy.lastLockOnShot || Date.now() - enemy.lastLockOnShot > 1500) {
          enemy.lastLockOnShot = Date.now();
          const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
          const vx = Math.cos(angle) * 2;
          const vy = Math.sin(angle) * 2;
          enemyBullets.push({ x: enemy.x, y: enemy.y, vx, vy, size: 5, damage: 20, lockon: true, spawnTime: Date.now() });
        }
      }
    } else {
      // Behavior based on phase
      if (currentPhase <= 2) {
        if (Math.random() < 0.005 && Math.hypot(player.x - enemy.x, player.y - enemy.y) > 100) {
          enemy.rushTargetX = player.x;
          enemy.rushTargetY = player.y;
          enemy.rushing = true;
          enemy.rushStartTime = Date.now();
        } else if (Math.random() < 0.01 && !enemy.lockOnActive) {
          enemy.lockOnActive = true;
          enemy.lockOnEndTime = Date.now() + 3000;
        } else if (Math.random() < 0.02 && !enemy.circleAttackActive && Date.now() > enemy.circleAttackCooldown) {
          performCircleAttack();
        }
      } else {
        if (Math.random() < 0.008 && Math.hypot(player.x - enemy.x, player.y - enemy.y) > 100) {
          enemy.rushTargetX = player.x;
          enemy.rushTargetY = player.y;
          enemy.rushing = true;
          enemy.rushStartTime = Date.now();
        } else if (Math.random() < 0.015 && !enemy.lockOnActive) {
          spawnLockOnBullets();
        } else if (Math.random() < 0.03 && !enemy.circleAttackActive && Date.now() > enemy.circleAttackCooldown) {
          performCircleAttack();
        }
      }
    }

    // Move towards player if not rushing or attacking
    if (!enemy.rushing && !enemy.lockOnActive && !enemy.circleAttackActive) {
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 1) {
        enemy.x += (dx / dist) * enemy.speed;
        enemy.y += (dy / dist) * enemy.speed;
      }
    }
  }

  function performCircleAttack() {
    if (enemy.circleAttackActive || Date.now() < enemy.circleAttackCooldown) return;
    enemy.circleAttackActive = true;
    const count = 20;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i;
      enemyBullets.push({
        x: enemy.x,
        y: enemy.y,
        vx: Math.cos(angle) * 4,
        vy: Math.sin(angle) * 4,
        size: 5,
        damage: 15
      });
    }
    setTimeout(() => { enemy.circleAttackActive = false; }, 2000);
    enemy.circleAttackCooldown = Date.now() + 15000;
  }

  function spawnLockOnBullets() {
    for (let i = 0; i < 5; i++) {
      const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
      const vx = Math.cos(angle) * 6;
      const vy = Math.sin(angle) * 6;
      enemyBullets.push({ x: enemy.x, y: enemy.y, vx, vy, size: 5, damage: 15, lockon: true, spawnTime: Date.now() });
    }
  }

  function handleLockOnBullets() {
    const now = Date.now();
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
      const b = enemyBullets[i];
      if (b.lockon) {
        const age = now - (b.spawnTime || 0);
        if (age > 20000) {
          enemyBullets.splice(i, 1);
          continue;
        }
        if (player) {
          const dx = player.x - b.x;
          const dy = player.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 1) {
            const chaseSpeed = 2;
            b.vx = Math.cos(Math.atan2(dy, dx)) * chaseSpeed;
            b.vy = Math.sin(Math.atan2(dy, dx)) * chaseSpeed;
          }
        }
      }
    }
  }

  function handleBullets() {
    // Player bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      b.x += b.vx;
      b.y += b.vy;
      // Check collision with enemy
      if (Math.hypot(b.x - enemy.x, b.y - enemy.y) < enemy.size / 2) {
        enemy.health -= b.damage || 1;
        bullets.splice(i, 1);
        continue;
      }
      // Remove if out of bounds
      if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
        bullets.splice(i, 1);
      }
    }

    // Enemy bullets
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
      const b = enemyBullets[i];
      b.x += b.vx;
      b.y += b.vy;
      // check collision with player
      if (player && Math.hypot(b.x - player.x, b.y - player.y) < player.size / 2) {
        alert('You were hit! Game Over.');
        setTimeout(() => location.reload(), 1000);
        return;
      }
      if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
        enemyBullets.splice(i, 1);
      }
    }
  }

  function checkCollision() {
    if (player && Math.hypot(player.x - enemy.x, player.y - enemy.y) < player.size + enemy.size) {
      alert('You collided with the enemy! Game Over.');
      setTimeout(() => location.reload(), 1000);
    }
  }

  // Periodic effects
  let lastDamageChangeTime = 0;
  let lastIbraheemDamageTime = 0;

  function handlePeriodicEffects() {
    // Jacob and Christopher: No special effects now

    // Ibraheem: no auto-damage
    // (Remove any code that damages Ibraheem automatically)

    // Jason damage variation
    if (player?.name === 'Jason' && player.health > 0) {
      player.damage = 1 + Math.random() * 9;
    }
  }
    function performAllAttacks() {
        const now = Date.now();

        // --- Circle Attack --- //
        if (!enemy.circleAttackActive && now > enemy.circleAttackCooldown) {
            enemy.circleAttackActive = true;
            const circleCount = 40; // More bullets than before
            const speedMultiplier = 4;
            for (let i = 0; i < circleCount; i++) {
                const angle = (Math.PI * 2 / circleCount) * i;
                enemyBullets.push({
                    x: enemy.x,
                    y: enemy.y,
                    vx: Math.cos(angle) * speedMultiplier,
                    vy: Math.sin(angle) * speedMultiplier,
                    size: 5,
                    damage: 15
                });
            }
            setTimeout(() => { enemy.circleAttackActive = false; }, 3000);
            enemy.circleAttackCooldown = now + 10000; // faster reuse
        }

        // --- Lock-On Bullets --- //
        const lockOnCount = 10; // more bullets
        for (let i = 0; i < lockOnCount; i++) {
            const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
            const vx = Math.cos(angle) * (4 + Math.random() * 3); // random speed
            const vy = Math.sin(angle) * (4 + Math.random() * 3);
            enemyBullets.push({ x: enemy.x, y: enemy.y, vx, vy, size: 5, damage: 20, lockon: true, spawnTime: now });
        }
        enemy.lockOnActive = true;
        enemy.lockOnEndTime = now + 3000;

        // --- Rush Attack --- //
        if (!enemy.rushing) {
            enemy.rushTargetX = player.x;
            enemy.rushTargetY = player.y;
            enemy.rushing = true;
            enemy.rushStartTime = now;
        }

        // --- Random Sprays --- //
        const sprayCount = 20;
        for (let i = 0; i < sprayCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 5;
            enemyBullets.push({
                x: enemy.x,
                y: enemy.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 4,
                damage: 10
            });
        }

        // --- Rapid Lock-On Mini Bursts --- //
        for (let i = 0; i < 5; i++) {
            const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x) + (Math.random() - 0.5) * 0.4;
            const speed = 6 + Math.random() * 2;
            enemyBullets.push({
                x: enemy.x,
                y: enemy.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 4,
                damage: 12,
                lockon: true,
                spawnTime: now
            });
        }
    }

  // Enemy attack patterns
  let lastEnemyFireTime = 0;

  function handleEnemyAttack() {
    if (Date.now() - lastEnemyFireTime > 2000) {
      spawnEnemyBullets(3);
      lastEnemyFireTime = Date.now();
    }

    if (currentPhase === 4) {
      performAllAttacks();
    } else {
      if (enemy.circleAttackActive) {
        performCircleOfBullets();
      }
    }
    handleLockOnBullets();
  }

  function spawnEnemyBullets(count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      enemyBullets.push({
        x: enemy.x,
        y: enemy.y,
        vx: Math.cos(angle) * 4,
        vy: Math.sin(angle) * 4,
        size: 5,
      });
    }
  }

  function performCircleOfBullets() {
    if (Date.now() > enemy.circleAttackCooldown) {
      enemy.circleAttackActive = true;
      const count = 20;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i;
        enemyBullets.push({
          x: enemy.x,
          y: enemy.y,
          vx: Math.cos(angle) * 4,
          vy: Math.sin(angle) * 4,
          size: 5,
          damage: 15
        });
      }
      setTimeout(() => { enemy.circleAttackActive = false; }, 2000);
      enemy.circleAttackCooldown = Date.now() + 15000;
    }
  }

  function spawnLockOnBullets() {
    for (let i = 0; i < 5; i++) {
      const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
      const vx = Math.cos(angle) * 6;
      const vy = Math.sin(angle) * 6;
      enemyBullets.push({ x: enemy.x, y: enemy.y, vx, vy, size: 5, damage: 15, lockon: true, spawnTime: Date.now() });
    }
  }

  // Draw everything
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    if (player) {
      ctx.fillStyle = characters[player.name].color;
      ctx.fillRect(player.x - player.size / 2, player.y - player.size / 2, player.size, player.size);
    }

    // Draw enemy
    if (enemy.health > 0) {
      ctx.save();
      ctx.translate(enemy.x, enemy.y);
      ctx.drawImage(enemyImage, -enemy.size, -enemy.size, enemy.size * 2, enemy.size * 2);
      ctx.restore();
    }

    // Player bullets
    for (const b of bullets) {
      ctx.fillStyle = 'white';
      ctx.fillRect(b.x - b.size, b.y - b.size, b.size * 2, b.size * 2);
    }

    // Enemy bullets
    for (const b of enemyBullets) {
      ctx.fillStyle = 'yellow';
      ctx.fillRect(b.x - b.size, b.y - b.size, b.size * 2, b.size * 2);
    }
  }

  // Update health bars
  function updateHealthBar() {
    const hpPercent = player ? (player.health / player.maxHealth) : 0;
    document.getElementById('healthBar').style.width = `${hpPercent * 100}%`;
  }

  function updateEnemyHealthBar() {
    const hpPercent = enemy.health / enemy.maxHealth;
    enemyHealthBar.style.width = `${hpPercent * 100}%`;
  }

  // Phase counter
  function updatePhaseCounter() {
    if (phaseCounter) {
      phaseCounter.textContent = `Phase: ${currentPhase}`;
    }
  }

  function nextPhase() {
    currentPhase++;
    if (currentPhase > Object.keys(phaseHealths).length) {
      // End the game if all phases are completed
      return;
    }
  
    // Reset enemy stats for the next phase
    enemy.health = phaseHealths[currentPhase];
    enemy.maxHealth = phaseHealths[currentPhase];
    enemy.x = 400;
    enemy.y = 150;
    enemy.lockOnActive = false;
    enemy.rushing = false;
    enemy.circleAttackCooldown = 0;
    enemy.circleAttackActive = false;
  
    // Update the phase counter display
    updatePhaseCounter();
  
    // Optionally reset player position or other phase-specific logic
    player.x = canvas.width / 2;
    player.y = canvas.height - 50;
  
    // Ensure the game loop continues
    requestAnimationFrame(update);
  }

  // Initialize phase display
  updatePhaseCounter();

});