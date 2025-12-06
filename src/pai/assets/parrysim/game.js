window.addEventListener('load', () => {
    (() => {

        let highScore = parseInt(localStorage.getItem('highScore')) || 0;
        const canvas = document.getElementById('game');
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const W = canvas.width, H = canvas.height;
        const state = { running: false, score: 0, hp: 15, maxHp: 20, spawnTimer: 0, frames: 0 };
        const keys = {};

        addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
        addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

        const GRAVITY = 0.4;
        const JUMP_SPEED = 15;

        const player = {
            x: 120, y: H - 64, w: 46, h: 64, baseH: 64,
            vx: 0, vy: 0, speed: 3.6,
            onGround: true, jumped: false,
            crouching: false, parryActive: false, parryTimer: 0,
            flash: 0, iFrames: 0
        };

        const bullets = [];
        const lasers = [];

        // ------------------- FLOWEY FACE SYSTEM -------------------

        // Idle faces
        const floweyIdle = [1, 2, 3].map(i => {
            const img = new Image();
            img.src = `floweyface${i}.png`;
            return img;
        });

        // Chaos (laugh) faces
        const chaosFaces = [];
        for (let i = 0; i < 4; i++) {
            const img = new Image();
            img.src = `floweyface4_${i}.png`;
            chaosFaces.push(img);
        }

        // Transition animations
        const trans12 = [], trans23 = [];
        for (let i = 1; i <= 5; i++) {
            const a = new Image();
            a.src = `floweyface1-2_${i}.png`;
            trans12.push(a);
            const b = new Image();
            b.src = `floweyface2-3_${i}.png`;
            trans23.push(b);
        }

        let currentPhase = 0;
        let faceAnim = { frames: [], index: 0, timer: 0, playing: false };
        let chaosFrame = 0, chaosTimer = 0;
        let currentFace = floweyIdle[0];

        const bgm = document.getElementById('bgm');
        bgm.loop = true;

        // ------------------- UTILITY FUNCTIONS -------------------

        function getLoudness() {
            const t = bgm.currentTime % 104;
            if (t < 9) return 0.3;
            if (t < 18) return 0.3 + (t - 9) / 9 * 0.2;
            if (t < 28) return 0.5 + (t - 18) / 10 * 0.2;
            if (t < 104) return 0.7 + (t - 28) / 76 * 0.3;
            return 0.3;
        }

        function getPhase() {
            const t = bgm.currentTime % 104;
            if (t < 9) return 0;
            if (t < 18) return 1;
            if (t < 28) return 2;
            return 3;
        }
        function getPhaseInfo() {
            const loudness = getLoudness();
            if (loudness < 0.4) return "Phase 1: Calm — Watch the slow bullets";
            if (loudness < 0.5) return "Phase 2: Picking Up — Bullets speed up";
            if (loudness < 0.7) return "Phase 3: Intense — More parry timing required";
            return "Phase 4: Chaos — Fast bullets, stay alert!";
        }
        function getSpawnInterval(loudness) {
            const minFrames = 30, maxFrames = 80;
            return maxFrames - (maxFrames - minFrames) * loudness;
        }

        function getBulletSpeed(loudness) {
            const maxSpeed = W, minSpeed = 4;
            return minSpeed + (maxSpeed - minSpeed) * loudness / 60;
        }
        const enemies = [];

        function spawnEnemy() {
            const x = W + 50;
            const y = H - 70 - 50; // on ground
            const w = 50, h = 50;

            const loudness = getLoudness();
            const speed = 1.5 + loudness * 4; // faster when louder
            const shootInterval = 120 - loudness * 80; // shoot more often when louder

            enemies.push({
                x, y, w, h, vx: -speed,
                shootTimer: 0,
                shootInterval, // tied to loudness
                type: Math.random() < 0.5 ? "normal" : "special"
            });
        }


        function checkHighScore() {
            if (state.score > highScore) {
                highScore = state.score;
                localStorage.setItem('highScore', highScore);
            }
        }

        function spawnBullet() {
            const loudness = getLoudness();
            const speed = getBulletSpeed(loudness);
            const y = H - 90 - Math.random() * 220;
            const typeChance = Math.random();

            let type = "black";
            let r = 14 + Math.random() * 6;
            let pink = false; // parryable

            if (typeChance < 0.4) {
                type = "pink";
                pink = true;
            } else if (typeChance < 0.6) {
                type = "fast";
                r = 10;
            } else if (typeChance < 0.8) {
                type = "big";
                r = 28;
            }

            let vx = -speed;
            if (type === "fast") vx *= 1.8;

            bullets.push({ x: W + 40, y, r, vx, vy: 0, pink, type });
        }


        function spawnLaser() {
            const typeChance = Math.random();
            const thickness = 18;
            const speed = 6 + Math.random() * 3;

            if (typeChance < 0.3) { // vertical
                const y = Math.random() * (H - 150) + 50;
                lasers.push({ x: W + 100, y, w: 300, h: thickness, color: "blue", vx: -speed, vy: 0 });
            } else if (typeChance < 0.6) { // horizontal
                const x = Math.random() * (W - 150);
                lasers.push({ x, y: -100, w: thickness, h: 300, color: "orange", vx: 0, vy: speed });
            } else { // angled
                const x = W + 50, y = Math.random() * (H - 150) + 50;
                lasers.push({ x, y, w: 200, h: thickness, color: "purple", vx: -speed, vy: speed });
            }
        }


        function damagePlayer() {
            if (player.iFrames > 0) return;
            state.hp--;
            player.flash = 30;
            player.iFrames = 90;

            const hs = document.getElementById('hurtSound');
            hs.pause(); hs.currentTime = 0; hs.play();

            if (state.hp <= 0) {
                state.running = false;
                const ds = Math.random() < 0.5 ? document.getElementById('deathSound1') : document.getElementById('deathSound2');
                ds.pause(); ds.currentTime = 0; ds.play();
            }
        }

        // ------------------- MAIN GAME LOOP -------------------

        function step() {
            if (!state.running) return;
            state.frames++;
            state.spawnTimer++;

            const loudness = getLoudness();
            const spawnInterval = getSpawnInterval(loudness);

            // ------------------- SPAWN -------------------
            if (state.spawnTimer >= spawnInterval) {
                state.spawnTimer = 0;
                spawnBullet();                     // regular bullets
                if (Math.random() < 0.15) spawnLaser(); // random lasers
            }

            // Spawn enemies every ~5 seconds
            if (state.frames % 300 === 0) spawnEnemy();

            // ------------------- PLAYER MOVEMENT -------------------
            const left = keys.arrowleft, right = keys.arrowright;
            const jumpKey = keys.z, downKey = keys.arrowdown;

            const targetH = downKey && player.onGround ? player.baseH * 0.75 : player.baseH;
            player.h += (targetH - player.h) * 0.25;
            player.crouching = downKey && player.onGround;

            player.vx = player.crouching ? 0 : (left ? -player.speed : (right ? player.speed : 0));

            if (jumpKey && player.onGround && !player.jumped && !player.crouching) {
                player.vy = -JUMP_SPEED;
                player.onGround = false;
                player.jumped = true;
            }

            if (!player.onGround && jumpKey && !player.parryActive && player.parryTimer <= 0) {
                player.parryActive = true;
                player.parryTimer = 20;
            }

            if (player.parryActive) {
                player.parryTimer--;
                if (player.parryTimer <= 0) player.parryActive = false;
            }

            if (!player.onGround) player.vy += GRAVITY;
            player.x += player.vx;
            player.y += player.vy;

            const ground = H - player.h;
            if (player.y > ground) {
                player.y = ground;
                player.vy = 0;
                player.onGround = true;
                player.jumped = false;
            }

            if (player.x < 6) player.x = 6;
            if (player.x + player.w > W - 6) player.x = W - 6 - player.w;

            if (player.iFrames > 0) player.iFrames--;

            // ------------------- PHASE & FACE -------------------
            const phase = getPhase();
            if (phase !== currentPhase) {
                if (currentPhase === 0 && phase === 1) faceAnim = { frames: trans12, index: 0, timer: 0, playing: true };
                else if (currentPhase === 1 && phase === 2) faceAnim = { frames: trans23, index: 0, timer: 0, playing: true };
                else if (phase === 3) {
                    faceAnim.playing = false;
                    chaosFrame = 0; chaosTimer = 0;
                }
                currentPhase = phase;
            }

            if (faceAnim.playing) {
                faceAnim.timer++;
                if (faceAnim.timer > 6) {
                    faceAnim.timer = 0;
                    faceAnim.index++;
                    if (faceAnim.index >= faceAnim.frames.length) {
                        faceAnim.playing = false;
                        currentFace = floweyIdle[currentPhase - 1] || floweyIdle[2];
                    } else currentFace = faceAnim.frames[faceAnim.index];
                }
            } else if (phase === 3) {
                chaosTimer++;
                if (chaosTimer > 3) {
                    chaosTimer = 0;
                    chaosFrame = (chaosFrame + 1) % chaosFaces.length;
                }
                currentFace = chaosFaces[chaosFrame];
            } else currentFace = floweyIdle[phase];

            // ------------------- BULLETS -------------------
            for (let i = bullets.length - 1; i >= 0; i--) {
                const b = bullets[i];
                b.x += b.vx;
                b.y += b.vy || 0;

                const px = player.x + player.w / 2;
                const py = player.y + player.h / 2;
                const d = Math.hypot(b.x - px, b.y - py);

                // Collision with player
                if (d < b.r + 28) {
                    if (b.pink && player.parryActive) {
                        bullets.splice(i, 1);
                        state.score += 10;
                        checkHighScore();
                        state.hp = Math.min(state.maxHp, state.hp + 1);
                        player.flash = 10;

                        const ps = document.getElementById('parrySound');
                        ps.pause(); ps.currentTime = 0;
                        ps.playbackRate = 0.9 + Math.random() * 0.2;
                        ps.play();
                    } else if (player.iFrames <= 0) {
                        bullets.splice(i, 1);
                        damagePlayer();
                    }
                }
                // Check if parryable bullet passes the player
                else if (b.pink && b.x + b.r < player.x) {
                    damagePlayer(); // Missed parryable bullet hits player
                    bullets.splice(i, 1);
                }
                // Remove other bullets that leave the screen
                else if (!b.pink && (b.x + b.r < 0 || b.x - b.r > W || b.y + b.r < 0 || b.y - b.r > H)) {
                    bullets.splice(i, 1);
                }
            }



            // ------------------- LASERS -------------------
            for (let i = lasers.length - 1; i >= 0; i--) {
                const l = lasers[i];
                l.x += l.vx; l.y += l.vy;

                if (l.x + l.w < 0 || l.x > W || l.y + l.h < 0 || l.y > H) {
                    lasers.splice(i, 1);
                    continue;
                }

                const hit = player.x + player.w > l.x && player.x < l.x + l.w &&
                    player.y + player.h > l.y && player.y < l.y + l.h;

                if (hit && player.iFrames <= 0) {
                    const moving = keys.arrowleft || keys.arrowright;
                    const damageCondition =
                        (l.color === "blue" && moving) ||
                        (l.color === "orange" && !moving) ||
                        (l.color === "purple"); // angled lasers always damage
                    if (damageCondition) damagePlayer();
                }
            }

            // ------------------- ENEMIES -------------------
            for (let i = enemies.length - 1; i >= 0; i--) {
                const e = enemies[i];
                const loudness = getLoudness();

                // Increase speed dynamically
                e.vx = - (1.5 + loudness * 4);

                e.shootTimer++;
                if (e.shootTimer >= e.shootInterval) {
                    e.shootTimer = 0;

                    const px = player.x + player.w / 2;
                    const py = player.y + player.h / 2;
                    const ex = e.x + e.w / 2;
                    const ey = e.y + e.h / 2;

                    if (e.type === "special") {
                        // More bullets with higher loudness
                        const spread = 0.25 + loudness * 0.5;
                        for (let a = -spread; a <= spread; a += spread / 2) {
                            shootEnemyBullet(ex, ey, px, py, 5 + loudness * 3, a);
                        }
                    } else {
                        // Normal enemy bullet
                        shootEnemyBullet(ex, ey, px, py, 4 + loudness * 2);
                    }
                }

                // Remove off-screen
                if (e.x + e.w < 0) enemies.splice(i, 1);
            }


            draw();
            if (state.running) requestAnimationFrame(step);
        }



        function shootEnemyBullet(ex, ey, px, py, speed, angleOffset = 0, pink = false) {
            const dx = px - ex;
            const dy = py - ey;
            const dist = Math.hypot(dx, dy);
            const vx = (dx / dist) * speed + angleOffset * speed;
            const vy = (dy / dist) * speed + angleOffset * speed;

            bullets.push({ x: ex, y: ey, r: pink ? 14 : 10, vx, vy, pink, type: "enemy" });
        }


        // ------------------- DRAW -------------------

        function draw() {
            const phase = getPhase();
            const chaosPhase = phase === 3;

            // Background
            if (chaosPhase) {
                const pulse = 150 + Math.sin(Date.now() / 200) * 20;
                ctx.fillStyle = `rgb(${pulse}, ${pulse / 3}, ${pulse / 3})`;
            } else ctx.fillStyle = '#9fe';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Phase info
            const phaseInfo = getPhaseInfo();

            // Ground
            ctx.fillStyle = '#2b7';
            ctx.fillRect(0, H - 70, canvas.width, 70);

            // HUD
            ctx.fillStyle = '#000';
            ctx.font = '28px DTM';
            ctx.textAlign = 'center';
            ctx.fillText(`Score: ${state.score}  |  High Score: ${highScore}`, W / 2, 40);
            ctx.font = '18px DTM';
            ctx.fillText(phaseInfo, W / 2, 70);

            // Controls info
            ctx.font = '15px DTM';
            ctx.fillText('Controls: Enter=Start Z=Jump/Parry Arrow Keys=Move, Down=Crouch Pink=Parry if Miss -1HP else +1HP Orange=Move if Not -1HP Blue=Stand Still if Move -1HP', W / 2, H - 10);

            // ------------------- PLAYER -------------------
            ctx.save();
            if (player.iFrames > 0 && Math.floor(player.iFrames / 5) % 2 === 0)
                ctx.globalAlpha = 0.5;

            ctx.fillStyle = '#222';
            ctx.fillRect(player.x, player.y, player.w, player.h);
            ctx.globalAlpha = 1;

            const eyeY = player.crouching ? player.y + 28 : player.y + 14;
            ctx.fillStyle = '#fff';
            ctx.fillRect(player.x + 10, eyeY, 8, 8);
            ctx.fillRect(player.x + 28, eyeY, 8, 8);

            if (player.flash > 0) {
                ctx.globalAlpha = 0.5 + 0.5 * Math.sin(Date.now() / 50);
                ctx.strokeStyle = 'rgba(255,100,200,0.9)';
                ctx.lineWidth = 8;
                ctx.beginPath();
                ctx.arc(player.x + player.w / 2, player.y + player.h / 2, 70, 0, Math.PI * 2);
                ctx.stroke();
                ctx.globalAlpha = 1;
                player.flash--;
            }

            if (player.parryActive) {
                ctx.beginPath();
                ctx.arc(player.x + player.w / 2, player.y + player.h / 2, 68, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(255,180,220,0.85)';
                ctx.lineWidth = 6;
                ctx.stroke();
            }

            ctx.restore();

            // ------------------- FLOWEY FACE -------------------
            if (currentFace && currentFace.complete) {
                const size = 120;
                ctx.drawImage(currentFace, 20, 20, size, size);
            }

            // ------------------- BULLETS -------------------
            for (const b of bullets) {
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                if (b.pink) {
                    // Parryable bullets are pink gradient
                    const grad = ctx.createRadialGradient(b.x, b.y, 2, b.x, b.y, b.r);
                    grad.addColorStop(0, '#fff');
                    grad.addColorStop(0.5, '#ffb5f2');
                    grad.addColorStop(1, '#ff33ff');
                    ctx.fillStyle = grad;
                    ctx.fill();
                    ctx.strokeStyle = '#ff33ff';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                } else if (b.type === "enemy") {
                    ctx.fillStyle = '#880';
                    ctx.fill();
                    ctx.strokeStyle = '#440';
                    ctx.stroke();
                } else {
                    ctx.fillStyle = '#000';
                    ctx.fill();
                    ctx.strokeStyle = '#111';
                    ctx.stroke();
                }
            }



            // ------------------- LASERS -------------------
            for (const l of lasers) {
                if (l.color === 'blue') ctx.fillStyle = 'rgba(100,150,255,0.8)';
                else if (l.color === 'orange') ctx.fillStyle = 'rgba(255,150,50,0.8)';
                else ctx.fillStyle = 'rgba(180,50,255,0.8)'; // purple

                ctx.fillRect(l.x, l.y, l.w, l.h);
            }

            // ------------------- ENEMIES -------------------
            for (const e of enemies) {
                ctx.fillStyle = '#a22';
                ctx.fillRect(e.x, e.y, e.w, e.h);
                ctx.fillStyle = '#000';
                ctx.fillRect(e.x + 10, e.y + 10, e.w - 20, e.h - 20);
            }

            // ------------------- HEALTH BAR -------------------
            const barWidth = 300, barHeight = 20;
            const healthRatio = state.hp / state.maxHp;
            const barX = (W - barWidth) / 2, barY = H - 50;

            ctx.fillStyle = '#555';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            ctx.fillStyle = '#ff0';
            ctx.fillRect(barX, barY, barWidth * healthRatio, barHeight);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.strokeRect(barX, barY, barWidth, barHeight);
        }


        // ------------------- START -------------------

        addEventListener('keydown', e => {
            if (e.key === "Enter" && !state.running) {
                startGame();
            }
        });

        document.getElementById('start').addEventListener('click', () => {
            if (!state.running) startGame();
        });

        function startGame() {
            state.score = 0;
            state.hp = state.maxHp;
            state.running = true;
            bullets.length = 0;
            lasers.length = 0;
            currentPhase = 0;
            chaosFrame = 0;
            chaosTimer = 0;
            faceAnim.playing = false;
            bgm.currentTime = 0;
            bgm.play();
            requestAnimationFrame(step);
        }

        draw();

    })();
});
