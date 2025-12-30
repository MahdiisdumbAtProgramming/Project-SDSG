                                                        (() => {
                                                            'use strict';
                                                            // --- DOM Caching ---
                                                            const g = document.getElementById('game');
                                                            const p = document.getElementById('player');
                                                            const fw = document.getElementById('flowey');
                                                            const w = document.getElementById('warning');
                                                            const hpF = document.getElementById('hpFill');
                                                            const a = document.getElementById('actBtn');
                                                            const s = [...document.querySelectorAll('.soul')];

                                                            // --- Bullet Visibility: Ensure CSS and DOM ---
                                                            const style = document.createElement('style');
                                                            style.innerHTML = `
                                                                .bullet {
                                                                    width: 12px;
                                                                    height: 12px;
                                                                    background: radial-gradient(circle at 50% 50%, #ff0 70%, #ffa 100%);
                                                                    border-radius: 50%;
                                                                    box-shadow: 0 0 6px #ff0;
                                                                    position: absolute;
                                                                    opacity: 1;
                                                                    z-index: 100;
                                                                }
                                                                .player.hit { box-shadow: 0 0 16px 8px rgba(255,0,0,0.7); }
                                                                .player.heal { box-shadow: 0 0 16px 8px rgba(0,255,0,0.5); }
                                                                .flash { animation: flash 0.6s infinite alternate; }
                                                                @keyframes flash { from { opacity: 1 } to { opacity: 0.2 } }
                                                            `;
                                                            document.head.appendChild(style);

                                                            // --- Audio Engine ---
                                                            const audioCache = {};
                                                            function makeAudio(src, { loop = false, volume = 1 } = {}) {
                                                                if (!src) return null;
                                                                try {
                                                                    const a = new Audio(src);
                                                                    a.loop = !!loop;
                                                                    a.volume = volume;
                                                                    return a;
                                                                } catch {
                                                                    return null;
                                                                }
                                                            }
                                                            function playSound(src, { volume = 1, loop = false } = {}) {
                                                                if (!src) return null;
                                                                if (!audioCache[src]) {
                                                                    audioCache[src] = makeAudio(src, { loop: false, volume });
                                                                }
                                                                const audio = audioCache[src];
                                                                if (!audio) return null;
                                                                audio.volume = volume;
                                                                audio.loop = loop;
                                                                try {
                                                                    audio.currentTime = 0;
                                                                    audio.play();
                                                                } catch {
                                                                    // autoplay policies may block; ignore
                                                                }
                                                                return audio;
                                                            }

                                                            // Safe getter: returns an existing <audio> by id, else a new Audio object (not played)
                                                            const getAudio = (id, fallbackSrc) => {
                                                                try {
                                                                    const el = document.getElementById(id);
                                                                    if (el && el.tagName === 'AUDIO') return el;
                                                                } catch { }
                                                                return fallbackSrc ? makeAudio(fallbackSrc) : null;
                                                            };

                                                            // --- Original Audio Setup (do NOT autoplay on load) ---
                                                            const ft = getAudio('floweyTheme', 'ft.ogg');
                                                            const fta = getAudio('floweyAlt', 'fta.ogg');
                                                            const ftl = getAudio('floweyLoop', 'ftl.ogg');
                                                            let tm = getAudio('themes', 'themes.ogg'); // theme player
                                                            const d1 = getAudio('d1', 'death1.wav');
                                                            const d2 = getAudio('d2', 'death2.wav');
                                                            const ws = getAudio('warnSnd', 'atkwrn.wav');
                                                            const laugh = getAudio('laugh', 'laugh.wav');
                                                            const staticWav = getAudio('static', 'static.wav');
                                                            const introOgg = getAudio('introOgg', 'intro.ogg');
                                                            const preIntroOgg = getAudio('preIntroOgg', 'pf.ogg');
                                                            const ohSound = getAudio('ohSound', 'OH.wav');
                                                            const tedSound = getAudio('tedSound', 'TED.wav');
                                                            const preIntroImageSrc = 'pf.png';

                                                            // --- Game Data ---
                                                            const tf = ["1.ogg", "2.ogg", "3.ogg", "4.ogg", "5.ogg", "6.ogg"];
                                                            const defaultNames = ['Pizza', 'Jelly', 'PeanutButter', 'Idksterling', 'Martani', 'Code'];
                                                            const soulNames = s.map((el, idx) => (el.dataset && el.dataset.name) || defaultNames[idx] || `Soul${idx + 1}`);
                                                            const diags = [
                                                                "Hello",
                                                                "Yow-Know-Me-As-Kevin-Im-Zombyecares_alter-ego-However",
                                                                "I-Stole_er-Rather-used-mahdi-to-code-this",
                                                                "Uhhhhhhhhh?",
                                                                "Why-you-may-ask",
                                                                "Becuae-I_tourtred-him",
                                                                "this-is-WIP-territory-BULLET-HELL",
                                                                "If-you-go-through-the-next-diag-the-game-will-start",
                                                                "You-Really-Are-An-IDIOT!"
                                                            ];

                                                            // --- State ---
                                                            let x = 380, y = 500, spd = 4, hp = 100;
                                                            const k = {};
                                                            let cp = true, i = 0, ins = false, cf = false, bi = null, pt = null, tc = 0, fights = 0;
                                                            let inFight = false, ff = false, ai = 0, postMode = false, actPresent = false, actLocked = false;
                                                            let recodeTextEl = null, inPreIntro = true, inIntro = false, diagIndex = 0;
                                                            let lastHitTime = 0;
                                                            const IFRAME_DURATION = 750;
                                                            let saveLoadCycle = 0;
                                                            let attacksStarted = false;

                                                            // --- Utility ---
                                                            const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
                                                            // ht: checks whether point (bx,by) hits player (x,y)
                                                            const ht = (bx, by, r = 18) => Math.hypot(bx - x, by - y) < r;
                                                            const cb = () => document.querySelectorAll('.bullet').forEach(b => b.remove());
                                                            const hf = o => [...g.children].forEach(el => {
                                                                if (el === p || el === o || ['hpBar', 'warning', 'actBtn'].includes(el.id)) return;
                                                                if (el.classList && el.classList.contains('bullet')) el.remove();
                                                                else el.style.display = 'none';
                                                            });
                                                            const sa = () => [...g.children].forEach(el => {
                                                                if (!['actBtn'].includes(el.id)) el.style.display = ''
                                                            });
                                                            const th = () => tc === 0 ? ft : tc === 1 ? fta : ftl;
                                                            const pauseAllMusic = () => {
                                                                [ft, fta, ftl, tm, ws, laugh, staticWav, introOgg, preIntroOgg].forEach(t => {
                                                                    try { if (t && typeof t.pause === 'function') { t.pause(); t.currentTime = 0; } } catch { }
                                                                });
                                                            };

                                                            const tracks = [ft, fta, ftl, tm, introOgg, laugh, staticWav, preIntroOgg].filter(Boolean);
                                                            const playMusic = (track, loop = false) => {
                                                                tracks.forEach(t => { try { if (t) { t.pause(); t.currentTime = 0; } } catch { } });
                                                                if (track) {
                                                                    try { track.loop = !!loop; track.currentTime = 0; track.play(); } catch { }
                                                                }
                                                            };

                                                            // --- Music System Improvements ---
                                                            const musicTracks = {
                                                                intro: introOgg,
                                                                preIntro: preIntroOgg,
                                                                battle: [ft, fta, ftl].filter(Boolean),
                                                                victory: makeAudio('win.wav'),
                                                                defeat: d1,
                                                                healing: staticWav
                                                            };
                                                            let currentMusic = null;
                                                            let fadeInterval = null;
                                                            function fadeOutMusic(track, duration = 800) {
                                                                if (!track || typeof track.volume !== 'number') { try { if (track && typeof track.pause === 'function') track.pause(); } catch { } return; }
                                                                clearInterval(fadeInterval);
                                                                const steps = Math.max(1, Math.floor(duration / 50));
                                                                const step = track.volume / steps;
                                                                fadeInterval = setInterval(() => {
                                                                    try {
                                                                        track.volume = Math.max(0, track.volume - step);
                                                                        if (track.volume <= 0.001) {
                                                                            track.pause();
                                                                            track.currentTime = 0;
                                                                            clearInterval(fadeInterval);
                                                                            track.volume = 1;
                                                                        }
                                                                    } catch {
                                                                        clearInterval(fadeInterval);
                                                                    }
                                                                }, 50);
                                                            }
                                                            function fadeInMusic(track, duration = 800, loop = false) {
                                                                if (!track || typeof track.volume !== 'number') { try { if (track && typeof track.play === 'function') track.play(); } catch { } return; }
                                                                clearInterval(fadeInterval);
                                                                track.volume = 0;
                                                                track.loop = loop;
                                                                try { track.currentTime = 0; track.play(); } catch { }
                                                                const steps = Math.max(1, Math.floor(duration / 50));
                                                                const step = 1 / steps;
                                                                fadeInterval = setInterval(() => {
                                                                    try {
                                                                        track.volume = Math.min(1, track.volume + step);
                                                                        if (track.volume >= 0.999) clearInterval(fadeInterval);
                                                                    } catch {
                                                                        clearInterval(fadeInterval);
                                                                    }
                                                                }, 50);
                                                                currentMusic = track;
                                                            }
                                                            function playContextMusic(context) {
                                                                if (currentMusic) fadeOutMusic(currentMusic);
                                                                let track = Array.isArray(musicTracks[context])
                                                                    ? musicTracks[context][Math.floor(Math.random() * musicTracks[context].length)]
                                                                    : musicTracks[context];
                                                                fadeInMusic(track, 1000, context === 'battle');
                                                            }

                                                            // --- Major Rendering Upgrade: requestAnimationFrame for Movement ---
                                                            function lp() {
                                                                if (!inIntro && !inPreIntro) {
                                                                    if (k.ArrowUp) y -= spd;
                                                                    if (k.ArrowDown) y += spd;
                                                                    if (k.ArrowLeft) x -= spd;
                                                                    if (k.ArrowRight) x += spd;
                                                                    x = clamp(x, 0, 760);
                                                                    y = clamp(y, 0, 560);
                                                                    if (p) {
                                                                        p.style.left = x + 'px';
                                                                        p.style.top = y + 'px';
                                                                    }
                                                                    // Animate freed souls
                                                                    s.filter(o => o.classList.contains('freed')).forEach((o, j) => {
                                                                        o.style.left = (x + 50 + j * 30) + 'px';
                                                                        o.style.top = (y + 10) + 'px';
                                                                        o.style.transform = 'scale(1.1)';
                                                                        setTimeout(() => o.style.transform = '', 120);
                                                                    });
                                                                }
                                                                requestAnimationFrame(lp);
                                                            }

                                                            // --- Visual Feedback for Hits/Heals ---
                                                            function takeDamage(amount) {
                                                                const now = Date.now();
                                                                if (now - lastHitTime < IFRAME_DURATION) return false;
                                                                lastHitTime = now;
                                                                hp = Math.max(0, hp - amount);
                                                                if (hpF) hpF.style.width = hp + '%';
                                                                if (p) p.classList.add('hit');
                                                                setTimeout(() => p && p.classList.remove('hit'), 140);
                                                                if (hp <= 0) dd();
                                                                return true;
                                                            }
                                                            function applyHeal(amount) {
                                                                hp = Math.min(100, hp + amount);
                                                                if (hpF) hpF.style.width = hp + '%';
                                                                if (p) p.classList.add('heal');
                                                                setTimeout(() => p && p.classList.remove('heal'), 140);
                                                            }

                                                            // --- Bullet Movement: requestAnimationFrame ---
                                                            function moveBullet(b, bx, by, ang, sp, healType = false) {
                                                                function step() {
                                                                    bx += Math.cos(ang) * sp;
                                                                    by += Math.sin(ang) * sp;
                                                                    b.style.left = bx + 'px';
                                                                    b.style.top = by + 'px';
                                                                    if (ht(bx, by)) {
                                                                        if (healType) applyHeal(5);
                                                                        else takeDamage(5);
                                                                        b.style.opacity = 0;
                                                                        setTimeout(() => b.remove(), 100);
                                                                        return;
                                                                    }
                                                                    if (bx < -30 || bx > 830 || by < -30 || by > 630) {
                                                                        b.style.opacity = 0;
                                                                        setTimeout(() => b.remove(), 100);
                                                                        return;
                                                                    }
                                                                    requestAnimationFrame(step);
                                                                }
                                                                step();
                                                            }
                                                            function bl(cx, cy, ang, sp = 3, col = 'yellow') {
                                                                const b = document.createElement('div');
                                                                b.className = 'bullet';
                                                                b.style.backgroundColor = col;
                                                                let bx = cx, by = cy;
                                                                b.style.left = bx + 'px';
                                                                b.style.top = by + 'px';
                                                                g.appendChild(b);
                                                                moveBullet(b, bx, by, ang, sp, false);
                                                            }
                                                            function heal(cx, cy, ang, sp = 3, col = 'lime') {
                                                                const b = document.createElement('div');
                                                                b.className = 'bullet';
                                                                b.style.backgroundColor = col;
                                                                let bx = cx, by = cy;
                                                                b.style.left = bx + 'px';
                                                                b.style.top = by + 'px';
                                                                g.appendChild(b);
                                                                moveBullet(b, bx, by, ang, sp, true);
                                                            }

                                                            // --- Stop all <audio> elements helper ---
                                                            function stopAllMusic() {
                                                                document.querySelectorAll("audio").forEach(aud => {
                                                                    try { aud.pause(); aud.currentTime = 0; } catch { }
                                                                });
                                                                // also clear cached playSound instances
                                                                Object.keys(audioCache).forEach(k => {
                                                                    try { audioCache[k].pause(); audioCache[k].currentTime = 0; } catch { }
                                                                    delete audioCache[k];
                                                                });
                                                            }

                                                            // --- Attack Patterns ---
                                                            const floweyAttackPatterns = [
                                                                () => {
                                                                    const cx = fw.offsetLeft + fw.offsetWidth / 2;
                                                                    const cy = fw.offsetTop + fw.offsetHeight / 2;
                                                                    const sp = 3 + Math.random() * 2;
                                                                    const count = 16 + Math.floor(i * 1);
                                                                    for (let j = 0; j < count; j++) bl(cx, cy, (Math.PI * 2 / count) * j, sp, 'yellow');
                                                                },
                                                                () => {
                                                                    const cx = fw.offsetLeft + fw.offsetWidth / 2;
                                                                    const cy = fw.offsetTop + fw.offsetHeight / 2;
                                                                    const ang = Math.atan2(y - cy, x - cx);
                                                                    const shotCount = 5 + Math.floor(i / 2);
                                                                    for (let j = 0; j < shotCount; j++) bl(cx, cy, ang, 4, 'red');
                                                                },
                                                                () => {
                                                                    const cx = fw.offsetLeft + fw.offsetWidth / 2;
                                                                    const cy = fw.offsetTop + fw.offsetHeight / 2;
                                                                    let t = 0;
                                                                    const it = setInterval(() => { bl(cx, cy, t, 3, 'orange'); t += Math.PI / 12; }, 50);
                                                                    setTimeout(() => clearInterval(it), 1500);
                                                                },
                                                                () => {
                                                                    const cx = fw.offsetLeft + fw.offsetWidth / 2;
                                                                    const cy = fw.offsetTop + fw.offsetHeight / 2;
                                                                    for (let row = 0; row < 6; row++) {
                                                                        const ang = row % 2 === 0 ? 0 : Math.PI;
                                                                        for (let j = 0; j < 8 + Math.floor(i / 2); j++) bl(cx, cy + row * 20, ang, 3, 'green');
                                                                    }
                                                                },
                                                                () => {
                                                                    const cx = fw.offsetLeft + fw.offsetWidth / 2;
                                                                    const cy = fw.offsetTop + fw.offsetHeight / 2;
                                                                    let t = 0;
                                                                    const it = setInterval(() => { heal(cx, cy, t, 3, 'lime'); t += Math.PI / 12; }, 50);
                                                                    setTimeout(() => clearInterval(it), 1500);
                                                                },
                                                                // warn + falling floweys
                                                                () => {
                                                                    const warnSnd = makeAudio('atkwrn.wav');
                                                                    if (warnSnd) { warnSnd.loop = true; try { warnSnd.play(); } catch { } }
                                                                    const lineCount = 10 + Math.floor(i * 2);
                                                                    for (let n = 0; n < lineCount; n++) {
                                                                        const lx = x + (Math.random() * 200 - 100);
                                                                        const ly = y - 200 + Math.random() * 400;
                                                                        const line = document.createElement('div');
                                                                        Object.assign(line.style, {
                                                                            position: 'absolute', left: lx + 'px', top: ly + 'px',
                                                                            width: '4px', height: '100px', background: 'linear-gradient(red,yellow)',
                                                                            animation: 'flash 0.2s infinite'
                                                                        });
                                                                        g.appendChild(line);
                                                                        setTimeout(() => {
                                                                            line.remove();
                                                                            if (n === 0 && warnSnd) { try { warnSnd.pause(); warnSnd.currentTime = 0; } catch { } new Audio('fc.wav').play(); }
                                                                            const img = document.createElement('img');
                                                                            img.src = 'flowey.png';
                                                                            Object.assign(img.style, { position: 'absolute', left: lx + 'px', top: '-50px', width: '50px', height: '50px' });
                                                                            g.appendChild(img);
                                                                            const it = setInterval(() => {
                                                                                img.style.top = (parseInt(img.style.top, 10) + 10) + 'px';
                                                                                if (ht(parseInt(img.style.left, 10), parseInt(img.style.top, 10))) takeDamage(15);
                                                                                if (parseInt(img.style.top, 10) > 620) { img.remove(); clearInterval(it); }
                                                                            }, 30);
                                                                        }, 600 + Math.random() * 800);
                                                                    }
                                                                },
                                                                // warning box + laser
                                                                () => {
                                                                    const warnSnd = makeAudio('atkwrn.wav');
                                                                    if (warnSnd) { warnSnd.loop = true; try { warnSnd.play(); } catch { } }
                                                                    const bx = Math.random() * 700, by = Math.random() * 500;
                                                                    const box = document.createElement('div');
                                                                    Object.assign(box.style, {
                                                                        position: 'absolute', left: bx + 'px', top: by + 'px',
                                                                        width: '100px', height: '100px', border: '4px solid red',
                                                                        background: 'rgba(255,255,0,0.5)', display: 'flex', alignItems: 'center',
                                                                        justifyContent: 'center', fontSize: '48px', fontWeight: 'bold',
                                                                        animation: 'flash 0.3s infinite'
                                                                    });
                                                                    box.innerText = '!';
                                                                    g.appendChild(box);
                                                                    setTimeout(() => {
                                                                        if (warnSnd) { try { warnSnd.pause(); warnSnd.currentTime = 0; } catch { } }
                                                                        box.remove();
                                                                        const laser = document.createElement('div');
                                                                        Object.assign(laser.style, {
                                                                            position: 'absolute', left: bx + 'px', top: by + 'px',
                                                                            width: '100px', height: '100px', background: 'blue'
                                                                        });
                                                                        g.appendChild(laser);
                                                                        if (x > bx && x < bx + 100 && y > by && y < by + 100) takeDamage(100);
                                                                        setTimeout(() => laser.remove(), 500);
                                                                    }, 2200);
                                                                },
                                                                // pizza missiles
                                                                () => {
                                                                    const side = Math.random() < 0.5 ? 0 : 800;
                                                                    for (let n = 0; n < 12 + Math.floor(i * 1.5); n++) {
                                                                        const img = document.createElement('img');
                                                                        img.src = 'pizza.png';
                                                                        Object.assign(img.style, {
                                                                            position: 'absolute', left: side + 'px', top: (Math.random() * 600) + 'px',
                                                                            width: '40px', height: '40px'
                                                                        });
                                                                        g.appendChild(img);
                                                                        const targetX = fw.offsetLeft + fw.offsetWidth / 2;
                                                                        const targetY = fw.offsetTop + fw.offsetHeight / 2;
                                                                        const ang = Math.atan2(targetY - parseInt(img.style.top, 10), targetX - parseInt(img.style.left, 10));
                                                                        const it = setInterval(() => {
                                                                            img.style.left = (parseInt(img.style.left, 10) + Math.cos(ang) * (4 + i * 0.2)) + 'px';
                                                                            img.style.top = (parseInt(img.style.top, 10) + Math.sin(ang) * (4 + i * 0.2)) + 'px';
                                                                            if (ht(parseInt(img.style.left, 10), parseInt(img.style.top, 10))) { takeDamage(10); img.remove(); clearInterval(it); }
                                                                            if (parseInt(img.style.left, 10) < -50 || parseInt(img.style.left, 10) > 850) { img.remove(); clearInterval(it); }
                                                                        }, 30);
                                                                    }
                                                                },
                                                                // save/load glitch pattern (plays a looping audio then pulses)
                                                              
                                                                // falling nuke
                                                                () => {
                                                                    (new Audio('nf.wav')).play();
                                                                    const startX = Math.random() * 750, startY = -60;
                                                                    const nuke = document.createElement('img');
                                                                    nuke.src = 'nuke.png';
                                                                    Object.assign(nuke.style, { position: 'absolute', left: startX + 'px', top: startY + 'px', width: '50px', height: '50px' });
                                                                    g.appendChild(nuke);
                                                                    const fallSpeed = 5 + i * 0.4;
                                                                    const it = setInterval(() => {
                                                                        nuke.style.top = (parseInt(nuke.style.top, 10) + fallSpeed) + 'px';
                                                                        const nx = parseInt(nuke.style.left, 10), ny = parseInt(nuke.style.top, 10);
                                                                        if (ht(nx, ny)) { triggerExplosion(nx, ny); nuke.remove(); clearInterval(it); }
                                                                        if (ny >= 570) { triggerExplosion(nx, 570); nuke.remove(); clearInterval(it); }
                                                                    }, 30);
                                                                    function triggerExplosion(ex, ey) {
                                                                        (new Audio('ne.wav')).play();
                                                                        const fire = document.createElement('img');
                                                                        fire.src = 'fire.png';
                                                                        Object.assign(fire.style, { position: 'absolute', left: (ex - 50) + 'px', top: (ey - 50) + 'px', width: '150px', height: '150px' });
                                                                        g.appendChild(fire);
                                                                        if (Math.abs(x - ex) < 75 && Math.abs(y - ey) < 75) takeDamage(40);
                                                                        setTimeout(() => fire.remove(), 500);
                                                                    }
                                                                },
                                                                // bouncing jelly pizza
                                                                () => {
                                                                    (new Audio('ag.wav')).play();
                                                                    const jellyPizza = document.createElement('img');
                                                                    jellyPizza.src = 'jellypizza.png';
                                                                    Object.assign(jellyPizza.style, { position: 'absolute', left: (Math.random() * 700) + 'px', top: (Math.random() * 500) + 'px', width: '60px', height: '60px' });
                                                                    g.appendChild(jellyPizza);
                                                                    let vx = (Math.random() < 0.5 ? -1 : 1) * (3 + Math.random() * 2);
                                                                    let vy = (Math.random() < 0.5 ? -1 : 1) * (3 + Math.random() * 2);
                                                                    const it = setInterval(() => {
                                                                        let px = parseInt(jellyPizza.style.left, 10), py = parseInt(jellyPizza.style.top, 10);
                                                                        px += vx; py += vy;
                                                                        if (px <= 0 || px >= 760) { vx *= -1; px = clamp(px, 0, 760); }
                                                                        if (py <= 0 || py >= 560) { vy *= -1; py = clamp(py, 0, 560); }
                                                                        jellyPizza.style.left = px + 'px'; jellyPizza.style.top = py + 'px';
                                                                        if (Math.random() < 0.02) new Audio('aa.wav').play();
                                                                        if (ht(px, py)) takeDamage(15);
                                                                    }, 30);
                                                                    setTimeout(() => { clearInterval(it); jellyPizza.remove(); }, 10000);
                                                                }
                                                            ];

                                                            // --- Act spawn during soul fight ---
                                                            function spawnActDuringSoul(duration = 6000) {
                                                                if (actPresent || postMode || !ins) return;
                                                                actPresent = true;
                                                                actLocked = false;
                                                                a.style.display = 'block';
                                                                a.classList.add('flash');
                                                                a.style.transform = 'scale(1)';
                                                                const px = 40 + Math.floor(Math.random() * 680);
                                                                const py = 80 + Math.floor(Math.random() * 420);
                                                                a.style.left = px + 'px';
                                                                a.style.top = py + 'px';
                                                                let t = 0;
                                                                const floatIt = setInterval(() => {
                                                                    t += 0.06;
                                                                    a.style.top = (py + Math.sin(t) * 8) + 'px';
                                                                    a.style.left = (px + Math.cos(t * 0.7) * 8) + 'px';
                                                                }, 33);
                                                                const chk = setInterval(() => {
                                                                    const ax = parseFloat(a.style.left), ay = parseFloat(a.style.top);
                                                                    cf = ht(ax, ay);
                                                                }, 60);
                                                                const despawn = setTimeout(() => {
                                                                    clearInterval(floatIt);
                                                                    clearInterval(chk);
                                                                    a.style.display = 'none';
                                                                    a.classList.remove('flash');
                                                                    actPresent = false;
                                                                    cf = false;
                                                                }, duration);
                                                                const onClick = () => {
                                                                    if (actLocked) return;
                                                                    actLocked = true;
                                                                    clearInterval(floatIt);
                                                                    clearInterval(chk);
                                                                    clearTimeout(despawn);
                                                                    a.style.display = 'none';
                                                                    a.classList.remove('flash');
                                                                    actPresent = false;
                                                                    cf = false;
                                                                    actPressed();
                                                                };
                                                                a.addEventListener('click', onClick, { once: true });
                                                                setTimeout(() => {
                                                                    try { a.removeEventListener('click', onClick); } catch { }
                                                                }, duration + 120);
                                                            }
                                                            function actPressed() {
                                                                const name = soulNames[i] || `Soul ${i + 1}`;
                                                                showRecodedMessage(name);
                                                                setTimeout(() => { removeRecodedMessage(); fs(); }, 2000);
                                                            }
                                                            function showRecodedMessage(name) {
                                                                removeRecodedMessage();
                                                                recodeTextEl = document.createElement('div');
                                                                recodeTextEl.className = 'recodeMsg';
                                                                Object.assign(recodeTextEl.style, {
                                                                    position: 'absolute', left: '50%', top: '14%', transform: 'translateX(-50%)',
                                                                    color: '#fff', fontSize: '20px', padding: '10px 16px',
                                                                    background: 'rgba(0,0,0,0.6)', borderRadius: '6px', zIndex: 9999
                                                                });
                                                                recodeTextEl.innerText = `You recoded the ${name}...`;
                                                                g.appendChild(recodeTextEl);
                                                            }
                                                            function removeRecodedMessage() {
                                                                if (recodeTextEl && g.contains(recodeTextEl)) recodeTextEl.remove();
                                                                recodeTextEl = null;
                                                            }

                                                            // --- Helper shot waves/spawn act
                                                            function spw(cx, cy) {
                                                                let t = 0;
                                                                const it = setInterval(() => {
                                                                    bl(cx, cy, t, 3, 'red');
                                                                    bl(cx, cy, t + Math.PI, 3, 'red');
                                                                    t += 0.3;
                                                                }, 60);
                                                                setTimeout(() => clearInterval(it), 2400);
                                                            }
                                                            const ap = [
                                                                () => { for (let j = 0; j < 22; j++) bl(400, 150, (Math.PI * 2 / 22) * j, 3, 'orange'); setTimeout(() => abSpawnAct(400, 150, 0, 3), 2000); },
                                                                () => { spw(400, 150); setTimeout(() => abSpawnAct(400, 150, 0, 3), 2000); },
                                                                () => { for (let j = 0; j < 16; j++) bl(400, 150, (Math.PI * 2 / 16) * j, 4, 'blue'); setTimeout(() => abSpawnAct(400, 150, Math.PI / 2, 3), 2000); },
                                                                () => { for (let j = 0; j < 36; j++) bl(400, 150, (Math.PI * 2 / 36) * j, 2, 'green'); setTimeout(() => abSpawnAct(400, 150, Math.PI, 3), 2000); },
                                                                () => { for (let j = 0; j < 12; j++) bl(400, 150, (Math.PI * 2 / 12) * j, 5, 'purple'); setTimeout(() => abSpawnAct(400, 150, Math.PI / 4, 3), 2000); },
                                                                () => { for (let j = 0; j < 8; j++) bl(400, 150, (Math.PI * 2 / 8) * j, 6, 'cyan'); setTimeout(() => abSpawnAct(400, 150, -Math.PI / 4, 3), 2000); }
                                                            ];
                                                            function abSpawnAct(cx, cy, ang, sp = 3) {
                                                                let bx = cx, by = cy;
                                                                const proj = document.createElement('div');
                                                                proj.className = 'bullet';
                                                                proj.style.backgroundColor = 'white';
                                                                proj.style.left = bx + 'px';
                                                                proj.style.top = by + 'px';
                                                                g.appendChild(proj);
                                                                const it = setInterval(() => {
                                                                    bx += Math.cos(ang) * sp;
                                                                    by += Math.sin(ang) * sp;
                                                                    proj.style.left = bx + 'px';
                                                                    proj.style.top = by + 'px';
                                                                    if (bx < -20 || bx > 820 || by < -20 || by > 620) { proj.remove(); clearInterval(it); spawnActDuringSoul(6000); }
                                                                }, 30);
                                                                setTimeout(() => { if (Math.random() < 0.6 && g.contains(proj)) { proj.remove(); clearInterval(it); spawnActDuringSoul(6000); } }, 650 + Math.random() * 900);
                                                            }

                                                            function ak() {
                                                                if (i >= s.length) return;
                                                                ap[ai % ap.length]();
                                                                ai++;
                                                                setTimeout(() => {
                                                                    if (ins && !actLocked && i < s.length) fl();
                                                                }, 16000);
                                                            }

                                                            function fs() {
                                                                a.style.display = 'none';
                                                                a.classList.remove('flash');
                                                                actPresent = false;
                                                                actLocked = false;
                                                                cf = false;
                                                                try { if (d2) { d2.currentTime = 0; d2.play(); } } catch { }
                                                                hp = 100;
                                                                if (hpF) hpF.style.width = '100%';
                                                                if (i < s.length) s[i].classList.add('freed');
                                                                i++;
                                                                ins = false;
                                                                if (tm && typeof tm.pause === 'function') tm.pause();
                                                                sa();
                                                                tc = (tc + 1) % 3;
                                                                if (i >= s.length) { playSoulsHealingThenFinal(); } else { sf(); }
                                                            }

                                                            // single fl implementation
                                                            function fl() {
                                                                a.style.display = 'none';
                                                                a.classList.remove('flash');
                                                                actPresent = false;
                                                                actLocked = false;
                                                                cf = false;
                                                                ins = false;
                                                                if (tm && typeof tm.pause === 'function') tm.pause();
                                                                sa();
                                                                tc = (tc + 1) % 3;
                                                                sf();
                                                            }

                                                            function sf() {
                                                                if (i >= s.length) return;
                                                                if (inIntro || inPreIntro) return;
                                                                pauseAllMusic();
                                                                try { const t = th(); if (t) { t.currentTime = 0; t.play(); } } catch { }
                                                                ins = false;
                                                                sa();
                                                                if (bi) clearInterval(bi);
                                                                bi = setInterval(() => { floweyAttackPatterns[Math.floor(Math.random() * floweyAttackPatterns.length)](); }, Math.max(800, 1400 - (i * 100)));
                                                                sw();
                                                            }
                                                            function st() { if (bi) clearInterval(bi); bi = null; }
                                                            function sw() { if (pt) clearTimeout(pt); if (i >= s.length) return; pt = setTimeout(() => bs(s[i]), Math.max(1000, 23000 - (i * 1000))); }

                                                            function bs(o) {
                                                                if (i >= s.length) { ep(); return; }
                                                                st();
                                                                cb();
                                                                if (w) w.style.display = 'block';
                                                                try { if (ws) { ws.currentTime = 0; ws.play(); } } catch { }
                                                                const doTransition = () => {
                                                                    x = 380; y = 540;
                                                                    if (p) { p.style.left = x + 'px'; p.style.top = y + 'px'; }
                                                                    for (let f = 0; f < 3; f++) {
                                                                        setTimeout(() => {
                                                                            const overlay = document.createElement('div');
                                                                            Object.assign(overlay.style, {
                                                                                position: 'absolute', left: 0, top: 0, width: '100%', height: '100%',
                                                                                background: f === 1 ? 'rgba(255,255,255,0.95)' : 'rgba(255,0,0,0.35)',
                                                                                zIndex: 9999, pointerEvents: 'none'
                                                                            });
                                                                            g.appendChild(overlay);
                                                                            setTimeout(() => overlay.remove(), 150);
                                                                        }, 120 * f);
                                                                    }
                                                                    setTimeout(() => {
                                                                        if (w) { w.style.display = 'none'; try { if (ws) { ws.pause(); ws.currentTime = 0; } } catch { } }
                                                                        try {
                                                                            if (introOgg) { introOgg.pause(); introOgg.currentTime = 0; }
                                                                            if (laugh) { laugh.pause(); laugh.currentTime = 0; }
                                                                            if (staticWav) { staticWav.pause(); staticWav.currentTime = 0; }
                                                                            if (tm) { tm.pause(); tm.currentTime = 0; }
                                                                        } catch { }
                                                                        try { if (tm) { tm.src = tf[i % tf.length]; tm.currentTime = 0; tm.play(); } } catch { }
                                                                        hf(o);
                                                                        ins = true;
                                                                        ak();
                                                                        setTimeout(() => { if (ins) spawnActDuringSoul(7000); }, 900 + Math.random() * 2000);
                                                                    }, 700);
                                                                };
                                                                setTimeout(doTransition, 350);
                                                            }

                                                            function dd() {
                                                                if (p) p.style.display = 'none';
                                                                let t1 = document.createElement('div'), t2 = document.createElement('div');
                                                                t1.className = 'tri left';
                                                                t2.className = 'tri right';
                                                                t1.style.left = x + 'px';
                                                                t1.style.top = y + 'px';
                                                                t2.style.left = x + 'px';
                                                                t2.style.top = y + 'px';
                                                                g.appendChild(t1);
                                                                g.appendChild(t2);
                                                                try { if (d1) { d1.currentTime = 0; d1.play(); } } catch { }
                                                                let o = 0;
                                                                const spdi = setInterval(() => {
                                                                    o += 2;
                                                                    t1.style.transform = `translateX(${-o}px)`;
                                                                    t2.style.transform = `translateX(${o}px)`;
                                                                    if (o >= 20) {
                                                                        clearInterval(spdi);
                                                                        try { if (d2) { d2.currentTime = 0; d2.play(); } } catch { }
                                                                        let f = 0;
                                                                        const flt = setInterval(() => {
                                                                            f += 4;
                                                                            t1.style.top = (y + f) + 'px';
                                                                            t2.style.top = (y + f) + 'px';
                                                                            if (f > 600) {
                                                                                clearInterval(flt);
                                                                                alert('You were defeated!');
                                                                                location.reload();
                                                                            }
                                                                        }, 30);
                                                                    }
                                                                }, 30);
                                                            }

                                                            function playOH(fightsCount) {
                                                                try {
                                                                    if (ohSound) { ohSound.pause(); ohSound.currentTime = 0; ohSound.playbackRate = 0.8 + Math.max(0, (fightsCount - 1)) * 0.1; ohSound.play(); }
                                                                    else (new Audio('OH.wav')).play();
                                                                } catch { try { (new Audio('OH.wav')).play(); } catch { } }
                                                            }
                                                            function playTED(fightsCount) {
                                                                try {
                                                                    if (tedSound) { tedSound.pause(); tedSound.currentTime = 0; tedSound.playbackRate = 0.8 + Math.max(0, (fightsCount - 6)) * 0.1; tedSound.play(); }
                                                                    else (new Audio('TED.wav')).play();
                                                                } catch { try { (new Audio('TED.wav')).play(); } catch { } }
                                                            }
                                                            function playAudio(aud) {
                                                                pauseAllMusic();
                                                                try { if (aud) { aud.currentTime = 0; aud.play(); } } catch { }
                                                            }
                                                            function wn() {
                                                                if (fw) fw.style.display = 'none';
                                                                const overlay = document.createElement('div');
                                                                Object.assign(overlay.style, {
                                                                    position: 'absolute', left: 0, top: 0, width: '100%', height: '100%',
                                                                    background: 'rgba(255,255,255,0.95)', zIndex: 10001, display: 'flex',
                                                                    alignItems: 'center', justifyContent: 'center', fontSize: '48px',
                                                                    color: '#222', fontWeight: 'bold', fontFamily: 'monospace', textShadow: '0 0 12px #fff'
                                                                });
                                                                overlay.innerText = 'YOU WIN!';
                                                                g.appendChild(overlay);
                                                                playAudio(makeAudio('win.wav'));
                                                                setTimeout(() => location.reload(), 3500);
                                                            }

                                                            function playDiagCharSound() {
                                                                try { const diagSnd = makeAudio('diag.wav'); if (diagSnd) { diagSnd.currentTime = 0; diagSnd.play(); } } catch { }
                                                            }

                                                            function playSoulsHealingThenFinal() {
                                                                st();
                                                                if (pt) clearTimeout(pt);
                                                                sa();
                                                                const freed = s.filter(el => el.classList.contains('freed'));
                                                                if (freed.length === 0) { setTimeout(() => startFinalPostMode(), 1000); return; }
                                                                const start = Date.now();
                                                                const duration = 10000;
                                                                try { if (staticWav) { staticWav.currentTime = 0; staticWav.play(); } } catch { }
                                                                const animIt = setInterval(() => {
                                                                    const t = (Date.now() - start) / duration;
                                                                    freed.forEach((el, idx) => {
                                                                        const targetX = x + 30 + (idx * 10) - (freed.length * 5);
                                                                        const targetY = y - 30;
                                                                        const sx = parseFloat(el.style.left) || el.offsetLeft || 100;
                                                                        const sy = parseFloat(el.style.top) || el.offsetTop || 100;
                                                                        const nx = sx + (targetX - sx) * (0.03 + 0.9 * t);
                                                                        const ny = sy + (targetY - sy) * (0.03 + 0.9 * t);
                                                                        el.style.left = nx + 'px';
                                                                        el.style.top = ny + 'px';
                                                                        el.style.transform = `scale(${1 + 0.25 * Math.sin((t + idx) * 6)})`;
                                                                    });
                                                                    if (hp < 100) { hp = Math.min(100, hp + 0.8); if (hpF) hpF.style.width = hp + '%'; }
                                                                    if (t >= 1) {
                                                                        clearInterval(animIt);
                                                                        freed.forEach(el => { el.style.transform = ''; });
                                                                        setTimeout(() => {
                                                                            try { if (staticWav) { staticWav.pause(); staticWav.currentTime = 0; } } catch { }
                                                                            startFinalPostMode();
                                                                        }, 300);
                                                                    }
                                                                }, 33);
                                                            }

                                                            function startFinalPostMode() {
                                                                postMode = true; fights = 0; inFight = false; cb(); sa(); if (fw) fw.style.display = 'block';
                                                                const overlay = document.createElement('div');
                                                                Object.assign(overlay.style, { position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', background: 'rgba(255,0,0,0.8)', zIndex: 9999, pointerEvents: 'none' });
                                                                g.appendChild(overlay);
                                                                setTimeout(() => overlay.remove(), 300);
                                                                try { if (laugh) { laugh.currentTime = 0; laugh.play(); } } catch { }
                                                                setTimeout(() => {
                                                                    try { if (ft) { ft.currentTime = 0; ft.loop = true; ft.play(); } } catch { }
                                                                    // replaced undefined sb() with updateFloweyInterval to keep flowey attacking cadence
                                                                    updateFloweyInterval();
                                                                }, 1200);
                                                                setTimeout(() => { bi = setInterval(() => { floweyAttackPatterns[Math.floor(Math.random() * floweyAttackPatterns.length)](); }, 1000); }, 2000);
                                                            }

                                                            function postAttack() { if (!postMode) return; floweyAttackPatterns[Math.floor(Math.random() * floweyAttackPatterns.length)](); setTimeout(postAttack, 2500 + Math.random() * 1200); }

                                                            // startSoulHeal: single definition
                                                            function startSoulHeal() {
                                                                setInterval(() => {
                                                                    if (s.some(o => o.classList.contains('freed')) && hp < 100) { hp = Math.min(100, hp + 0.2); if (hpF) hpF.style.width = hp + '%'; }
                                                                }, 500);
                                                            }

                                                            let floweyPatternIndex = 0;
                                                            function floweyAttack() { floweyAttackPatterns[floweyPatternIndex % floweyAttackPatterns.length](); floweyPatternIndex++; }
                                                            let floweyInterval = null;
                                                            function updateFloweyInterval() {
                                                                const delay = Math.max(500, 900 - (i * 80));
                                                                if (floweyInterval) clearInterval(floweyInterval);
                                                                floweyInterval = setInterval(() => { floweyAttack(); }, delay);
                                                            }

                                                            // --- Pre-intro / intro typing system (single copies) ---
                                                            let isTyping = false;
                                                            let typewriterTimeout = null;

                                                            function showPreIntroDialog() {
                                                                const box = document.getElementById('preIntroDialog');
                                                                if (!box) return;
                                                                const text = diags[diagIndex] || '';
                                                                box.innerText = '';
                                                                let idx = 0;
                                                                const isLast = diagIndex === diags.length - 1;
                                                                const speed = isLast ? 90 : 35; // slower for last diag
                                                                isTyping = true;
                                                                function typeChar() {
                                                                    if (idx < text.length) {
                                                                        box.innerText += text[idx];
                                                                        playDiagCharSound();
                                                                        idx++;
                                                                        typewriterTimeout = setTimeout(typeChar, speed);
                                                                    } else {
                                                                        isTyping = false;
                                                                        typewriterTimeout = null;
                                                                    }
                                                                }
                                                                typeChar();
                                                                window._finishTypewriter = () => {
                                                                    if (isTyping) {
                                                                        if (typewriterTimeout) clearTimeout(typewriterTimeout);
                                                                        for (; idx < text.length; idx++) box.appendChild(document.createTextNode(text[idx]));
                                                                        isTyping = false;
                                                                        typewriterTimeout = null;
                                                                    }
                                                                };
                                                            }

                                                            function advancePreIntroDialog() {
                                                                diagIndex++;
                                                                if (diagIndex >= diags.length) {
                                                                    window._finishTypewriter = null;
                                                                    endPreIntro();
                                                                } else {
                                                                    showPreIntroDialog();
                                                                }
                                                            }

                                                            function startPreIntro() {
                                                                inPreIntro = true; inIntro = false;
                                                                const existing = document.getElementById('preIntroOverlay');
                                                                if (existing) existing.remove();
                                                                const overlay = document.createElement('div');
                                                                overlay.id = 'preIntroOverlay';
                                                                Object.assign(overlay.style, { position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'black', color: 'white', zIndex: 10000, fontFamily: 'monospace' });
                                                                const img = document.createElement('img');
                                                                img.src = preIntroImageSrc;
                                                                Object.assign(img.style, { maxWidth: '60%', maxHeight: '50%', marginBottom: '20px', imageRendering: 'pixelated' });
                                                                overlay.appendChild(img);
                                                                const box = document.createElement('div');
                                                                box.id = 'preIntroDialog';
                                                                Object.assign(box.style, { padding: '12px 16px', background: 'rgba(0,0,0,0.8)', border: '2px solid #444', maxWidth: '80%', textAlign: 'center', fontSize: '20px' });
                                                                overlay.appendChild(box);
                                                                const hint = document.createElement('div');
                                                                hint.innerText = 'Press Z / Enter to continue';
                                                                Object.assign(hint.style, { marginTop: '12px', opacity: 0.6, fontSize: '14px' });
                                                                overlay.appendChild(hint);
                                                                g.appendChild(overlay);
                                                                try { if (preIntroOgg) { preIntroOgg.loop = true; preIntroOgg.currentTime = 0; preIntroOgg.play(); } } catch { }
                                                                diagIndex = 0;
                                                                showPreIntroDialog();
                                                            }

                                                            function endPreIntro() {
                                                                inPreIntro = false;
                                                                const overlay = document.getElementById('preIntroOverlay');
                                                                if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
                                                                try { if (preIntroOgg) { preIntroOgg.pause(); preIntroOgg.currentTime = 0; } } catch { }
                                                                intro();
                                                            }

                                                            function intro() {
                                                                inIntro = true;
                                                                const styleEl = document.createElement('style');
                                                                document.head.appendChild(styleEl);
                                                                try {
                                                                    styleEl.sheet.insertRule(`@keyframes pulse2 { from { opacity: 0.4; } to { opacity: 1; } }`, styleEl.sheet.cssRules.length);
                                                                    styleEl.sheet.insertRule(`@keyframes fadeIn2 { from { opacity: 0; } to { opacity: 1; } }`, styleEl.sheet.cssRules.length);
                                                                    styleEl.sheet.insertRule(`@keyframes blink2 { from { opacity: 1; } to { opacity: 0; } }`, styleEl.sheet.cssRules.length);
                                                                } catch { }
                                                                const flash = document.createElement('div');
                                                                Object.assign(flash.style, { position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', background: 'rgba(255,0,0,0.8)', zIndex: 9999, pointerEvents: 'none', opacity: 0, animation: 'pulse2 1s infinite alternate' });
                                                                g.appendChild(flash);
                                                                const warningText = document.createElement('div');
                                                                warningText.innerText = "DON'T TOUCH MY PIZZA!!";
                                                                Object.assign(warningText.style, { position: 'absolute', top: '20%', width: '100%', textAlign: 'center', fontSize: '36px', fontWeight: 'bold', color: '#fff', textShadow: '0 0 10px black', zIndex: 10000, opacity: 0, animation: 'fadeIn2 1s forwards' });
                                                                g.appendChild(warningText);
                                                                setTimeout(() => { warningText.style.animation = 'blink2 1s infinite alternate'; }, 1000);
                                                                try { if (introOgg) { introOgg.currentTime = 0; introOgg.play(); } } catch { }
                                                                if (fw) {
                                                                    fw.style.display = 'block';
                                                                    fw.style.opacity = 0; fw.style.transform = 'scale(0.2)'; fw.style.filter = 'drop-shadow(0 0 20px yellow)';
                                                                }
                                                                let scale = 0.2; let opacity = 0;
                                                                const entranceInterval = setInterval(() => {
                                                                    scale += 0.02; opacity += 0.04;
                                                                    if (fw) {
                                                                        fw.style.transform = `scale(${scale})`;
                                                                        fw.style.opacity = Math.min(1, opacity);
                                                                        fw.style.filter = `drop-shadow(0 0 ${10 + Math.sin(scale * Math.PI * 2) * 10}px yellow)`;
                                                                    }
                                                                    if (scale >= 1) {
                                                                        clearInterval(entranceInterval);
                                                                        try {
                                                                            if (laugh) {
                                                                                laugh.currentTime = 0;
                                                                                laugh.onended = () => {
                                                                                    flash.style.transition = 'opacity 0.5s'; flash.style.opacity = 0;
                                                                                    warningText.style.transition = 'opacity 0.5s'; warningText.style.opacity = 0;
                                                                                    setTimeout(() => {
                                                                                        if (g.contains(flash)) g.removeChild(flash);
                                                                                        if (g.contains(warningText)) g.removeChild(warningText);
                                                                                        pulseFloweyEntrance();
                                                                                        try { document.head.removeChild(styleEl); } catch { }
                                                                                    }, 500);
                                                                                };
                                                                                laugh.play();
                                                                            } else {
                                                                                // fallback
                                                                                setTimeout(() => {
                                                                                    flash.style.transition = 'opacity 0.5s'; flash.style.opacity = 0;
                                                                                    warningText.style.transition = 'opacity 0.5s'; warningText.style.opacity = 0;
                                                                                    setTimeout(() => {
                                                                                        if (g.contains(flash)) g.removeChild(flash);
                                                                                        if (g.contains(warningText)) g.removeChild(warningText);
                                                                                        pulseFloweyEntrance();
                                                                                        try { document.head.removeChild(styleEl); } catch { }
                                                                                    }, 500);
                                                                                }, 1500);
                                                                            }
                                                                        } catch {
                                                                            setTimeout(() => pulseFloweyEntrance(), 1500);
                                                                        }
                                                                    }
                                                                }, 30);
                                                            }
                                                            function pulseFloweyEntrance() {
                                                                if (!fw) return;
                                                                fw.style.transition = 'transform 0.3s, filter 0.3s';
                                                                fw.style.transform = 'scale(1.2)';
                                                                fw.style.filter = 'drop-shadow(0 0 40px yellow)';
                                                                setTimeout(() => {
                                                                    fw.style.transform = 'scale(1)';
                                                                    fw.style.filter = 'drop-shadow(0 0 20px yellow)';
                                                                    setTimeout(() => {
                                                                        inIntro = false;
                                                                        attacksStarted = true;
                                                                        sf();
                                                                    }, 700);
                                                                }, 300);
                                                            }

                                                            // --- Global key handlers (single pair) ---
                                                            window.addEventListener('keydown', e => {
                                                                k[e.key] = true;
                                                                // Pre-intro special handling
                                                                if (inPreIntro) {
                                                                    if (e.key === 'Shift') {
                                                                        if (typeof window._finishTypewriter === 'function') window._finishTypewriter();
                                                                        return;
                                                                    }
                                                                    if ((e.key === 'z' || e.key === 'Enter') && cp) {
                                                                        cp = false;
                                                                        setTimeout(() => cp = true, 120);
                                                                        if (!isTyping) advancePreIntroDialog();
                                                                        return;
                                                                    }
                                                                }
                                                                // Generic Z/Enter behavior
                                                                if ((e.key === 'z' || e.key === 'Enter') && cp) {
                                                                    cp = false;
                                                                    setTimeout(() => cp = true, 120);
                                                                    if (ins && cf && actPresent && !actLocked) {
                                                                        actLocked = true;
                                                                        a.style.display = 'none';
                                                                        a.classList.remove('flash');
                                                                        actPresent = false;
                                                                        cf = false;
                                                                        actPressed();
                                                                    }
                                                                    if (inFight && ff && typeof tg === 'function') tg();
                                                                }
                                                            });
                                                            window.addEventListener('keyup', e => { k[e.key] = false; });

                                                            // --- Start Game Loop ---
                                                            lp();
                                                            startSoulHeal();
                                                            startPreIntro();
                                                            updateFloweyInterval();

                                                            function ep() { /* end path placeholder */ }

                                                        })();