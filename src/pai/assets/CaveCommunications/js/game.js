(() => {
    'use strict'; const $ = id => document.getElementById(id); const logEl = $('log'); const playerHpEl = $('player-hp'); const enemyHpEl = $('enemy-hp'); const itemCountEl = $('item-count'); const resetBtn = $('reset'); const attackCanvas = $('battle-canvas'); const ctx = attackCanvas ? attackCanvas.getContext && attackCanvas.getContext('2d') : null; function safeSetText(el, txt) { if (el) el.textContent = txt }
    function safePlay(audio) { try { audio.currentTime = 0; audio.play() } catch (e) { } }
    function safePause(audio) { try { if (audio) audio.pause(); } catch (e) { } }
    function log(msg) {
        let mercyMsg = ""; if (opponents.length > 0 && typeof selectedOpponentIndex === "number" && opponents[selectedOpponentIndex]) {
            const op = opponents[selectedOpponentIndex]; if (op.mercyPattern.length > 0 && op.mercyProgress < op.mercyPattern.length) {
                mercyMsg = `<br><b>Mercy Requirement for ${op.name}:</b> ${op.mercyPattern.map((a, i) => {
                    if (i === op.mercyProgress) return `<u>${a.toUpperCase()}</u>`;
                    return a.toUpperCase();
                }).join(" → ")}`
            }
        }
        let olMsg = ""; if (isLowHPMusicPlaying) { olMsg = `<br><span style="color:#ff4444;font-weight:bold;">Choked up! the opponent is spare-able or one shot!</span>` }
        let fleeMsg = ""; if (playerHP <= 20) { fleeMsg = `<br><span style="color:#ffcc00;font-weight:bold;">Tip: You can flee by selecting Mercy &gt; Flee!</span>` }
        document.getElementById('log').innerHTML = msg.replace(/\n/g, '<br>') + mercyMsg + olMsg + fleeMsg
    }
    let consecutiveKills = 0; const musicTracks = [
  "mus/1.mp3", "mus/2.mp3", "mus/3.mp3", "mus/4.mp3", "mus/5.mp3",
  "mus/6.ogg", "mus/7.mp3", "mus/8.ogg", "mus/9.ogg", "mus/10.mp3",
]; let chosenTrack = musicTracks[Math.floor(Math.random() * musicTracks.length)]; const audio = document.createElement('audio'); audio.src = chosenTrack; audio.volume = 0.5; audio.loop = !0; audio.id = 'bg-music'; document.body.appendChild(audio); const olAudio = document.createElement('audio'); olAudio.src = "mus/OL.ogg"; olAudio.volume = 0.5; olAudio.loop = !0; olAudio.id = 'ol-music'; document.body.appendChild(olAudio); const heartbeatAudio = document.createElement('audio'); heartbeatAudio.src = 'sfx/heartbeat.wav'; document.body.appendChild(heartbeatAudio); const winAudio = document.createElement('audio'); winAudio.src = "sfx/w.ogg"; document.body.appendChild(winAudio); const loseAudio = document.createElement('audio'); loseAudio.src = "sfx/l.mp3"; document.body.appendChild(loseAudio); const hurtAudio = document.createElement('audio'); hurtAudio.src = "sfx/hurt.wav"; document.body.appendChild(hurtAudio); const slashAudio = document.createElement('audio'); slashAudio.src = "sfx/slash.wav"; document.body.appendChild(slashAudio); const healAudio = document.createElement('audio'); healAudio.src = "sfx/heal.wav"; document.body.appendChild(healAudio); const ohealAudio = document.createElement('audio'); ohealAudio.src = "sfx/oheal.wav"; document.body.appendChild(ohealAudio); const spareAudio = document.createElement('audio'); spareAudio.src = "sfx/s.wav"; document.body.appendChild(spareAudio); const killAudio = document.createElement('audio'); killAudio.src = "sfx/k.mp3"; document.body.appendChild(killAudio); const moveAudio = document.createElement('audio'); moveAudio.src = "sfx/mv.wav"; moveAudio.preload = "auto"; moveAudio.volume = 1; document.body.appendChild(moveAudio); const selectAudio = document.createElement('audio'); selectAudio.src = "sfx/sel.wav"; selectAudio.preload = "auto"; selectAudio.volume = 1; document.body.appendChild(selectAudio); let currentBossMusic = null; let heartbeatIntervalId = null; let isLowHPMusicPlaying = !1; function stopAllMusic() { safePause(audio); safePause(olAudio); safePause(currentBossMusic); safePause(winAudio); safePause(loseAudio) }
    function playMusic(file) { try { if (currentBossMusic) safePause(currentBossMusic); currentBossMusic = new Audio(file); currentBossMusic.loop = !0; currentBossMusic.volume = 1.0; safePlay(currentBossMusic) } catch (e) { } }
    function startHeartbeat() { if (heartbeatIntervalId) return; heartbeatIntervalId = setInterval(() => { try { heartbeatAudio.currentTime = 0; safePlay(heartbeatAudio) } catch (e) { } }, 1000) }
    function stopHeartbeat() { if (heartbeatIntervalId) { clearInterval(heartbeatIntervalId); heartbeatIntervalId = null } }
    function startMusic() {
        if (!isLowHPMusicPlaying) try { audio.play().catch(() => { }) } catch (e) { }
        document.body.removeEventListener('click', startMusic); document.body.removeEventListener('keydown', startMusic)
    }
    document.body.addEventListener('click', startMusic, { once: !0 }); document.body.addEventListener('keydown', startMusic, { once: !0 }); function playLowHPMusic() {
        if (!isLowHPMusicPlaying) {
            try { audio.pause(); olAudio.currentTime = 0; olAudio.play() } catch (e) { }
            isLowHPMusicPlaying = !0
        }
    }
    const mercyPatterns = [["compliment", "compliment", "flirt", "compliment", "insult"], ["insult", "flirt", "compliment", "insult", "compliment"], ["compliment", "flirt", "compliment", "insult", "flirt"], ["flirt", "compliment", "insult", "flirt", "compliment"], ["insult", "compliment", "flirt", "compliment", "insult"]]; const opponentNames = ["Paper", "Sand", "Flowerpot", "Boreiel", "Undone", "Alfice", "Asbore", "Metta-gone", "Napstablank", "Tempy", "BurgerShorts", "Muffin", "Creature Kid", "Jerrican", "Doggo", "Greater Cat", "Lesser Cat", "Glad Smarty", "Shywrong", "Gersad", "Kindy", "Doggy", "Grassrake", "Baron", "Washout", "Moldbig", "weakaircraft", "Volcano", "Not like", "waterrake", "pi", "Dipin", "Character", "Dreamer", "Mettaboy", "Flowbee", "Tormentor", "Unfine", "Ascore", "Napstapunk", "Temptation", "Burgerking", "Muffintop", "Unusual Pal", "Jerrycan", "Kitty", "Greater Wolf", "Lesser Wolf", "Happy Smarty", "Shyright", "Germson", "Bratcat", "Kitbrat", "Snowman", "Aarun", "Washya", "Moldtiny", "Tsunderecar", "Vulkan", "Not Sorry"]; let playerHP = 100; let playerItems = 1; let playerName = "Your"; let playerSoulColor = "#ff0000"; let playerSoulPng = "r.png"; let turnActive = !0; let menuState = "main"; let selectedIndex = 0; let selectedOpponentIndex = 0; let insults = ["ugh", "meh", "shh", "loser", "bleh", "stfu", "nope", "dust", "pfft", "sigh"]; let compliments = ["nice", "brave", "kind", "good", "wow", "yay", "cool", "smile", "ace", "gr8"]; let flirts = ["wink", "smile", "heart", "hug", "flirt"]; let totalInsults = 0; let totalCompliments = 0; let totalSpared = 0; let totalKilled = 0; let encounterCount = 0; let encounterResults = []; let currentEncounterOriginalCount = 0; let currentEncounterKills = 0; let currentEncounterSpared = 0; let inFinalBoss = !1; let opponents = []; function determineRoute() { if (totalKilled > totalSpared) return "genocide"; if (totalSpared > totalKilled) return "pacifist"; return "neutral" }
    function updateHP() { safeSetText(playerHpEl, playerHP); safeSetText(itemCountEl, playerItems); if (opponents.length > 0) safeSetText(enemyHpEl, opponents.map(o => `${o.name}: ${o.hp}`).join(", ")); else safeSetText(enemyHpEl, "None") }
    function checkLowHP() { const lowOpponent = opponents.find(op => op.hp > 0 && op.hp <= 20); if (lowOpponent && !isLowHPMusicPlaying) { audio.pause(); olAudio.currentTime = 0; olAudio.play(); isLowHPMusicPlaying = !0 } else if (!lowOpponent && isLowHPMusicPlaying) { olAudio.pause(); audio.play(); isLowHPMusicPlaying = !1 } }
    function generateOpponents(options = {}) {
        const isFinal = !!options.finalBoss; const list = []; if (isFinal) { list.push({ name: "Mahdiisdumb", hp: 400, state: "angry", mercyPattern: [], mercyProgress: 0, isFinal: !0 }) } else { const count = Math.floor(Math.random() * 3) + 1; const used = new Set(); for (let i = 0; i < count; i++) { let name; do { name = opponentNames[Math.floor(Math.random() * opponentNames.length)] } while (used.has(name)); used.add(name); list.push({ name, hp: 100, state: "angry", mercyPattern: mercyPatterns[Math.floor(Math.random() * mercyPatterns.length)], mercyProgress: 0, isFinal: !1 }) } }
        opponents = list; currentEncounterOriginalCount = list.length; currentEncounterKills = 0; currentEncounterSpared = 0; inFinalBoss = !!options.finalBoss; if (inFinalBoss) { const route = determineRoute(); const boss = opponents[0]; stopAllMusic(); if (route === "pacifist") { boss.name = "=)"; boss.hp = 999999; boss.mercyPattern = ["SURVIVE"]; boss.noAttack = !1; boss.attackType = "nonMercy"; boss.lowDamage = !1; playMusic("mus/dan.mp3"); startHeartbeat(); let battleTime = 0; const maxTime = 600000; const timerInterval = 1000; boss.canBeSpared = !1; const timerId = setInterval(() => { battleTime += timerInterval; const seconds = Math.floor(battleTime / 1000); log(`Survive time: ${seconds} / 600`); if (battleTime >= maxTime) { clearInterval(timerId); boss.canBeSpared = !0; boss.mercyPattern = ["YOU CAN SPARE NOW"]; log("You survived long enough! You can now spare WHAT EVER THE FUCK THIS CREATURE IS!") } }, timerInterval); const enemyBP = () => { const intensity = { spawnInterval: 5, speed: 16, insultChance: 1.0, damageRange: [5, 12], }; const bp = startBattlePhase(boss, 10000, intensity); bp.onAttackSpawn = (attack) => { if (!attack.hasCompliment && Math.random() < 0.1) { attack.hasCompliment = !0; log(`${boss.name} says: "You can do it!"`) } }; bp.setOnEnd(() => { if (battleTime < maxTime) enableMenu(); }) }; enemyBP() } else if (route === "genocide") { boss.name = "Mahdiisdumb"; boss.hp = 10000; boss.mercyPattern = ["NO MERCY"]; boss.noAttack = !1; boss.alwaysAttack = !0; boss.attackType = "insult"; playMusic("mus/sinner.mp3"); startHeartbeat() } else { boss.name = "Lambda Flower"; boss.hp = 5000; boss.mercyPattern = ["null"]; boss.noAttack = !1; boss.lowDamage = !0; boss.attackType = "mixed"; playMusic("mus/sb.mp3"); startHeartbeat() } }
        updateHP(); return opponents
    }
    function clearBattleAndUIForEnding() {
        try { if (battleAnimId) cancelAnimationFrame(battleAnimId); } catch (e) { }
        try { if (projectileSpawner) clearInterval(projectileSpawner); projectileSpawner = null } catch (e) { }
        try { if (heartbeatIntervalId) { clearInterval(heartbeatIntervalId); heartbeatIntervalId = null } } catch (e) { }
        try { document.removeEventListener('keydown', globalKeyHandler) } catch (e) { }
        try { window.onkeydown = null; document.onkeydown = null } catch (e) { }
        try { if (attackCanvas) attackCanvas.style.display = 'none' } catch (e) { }
        stopAllMusic()
    }
    function triggerGenocideEnding() {
        clearBattleAndUIForEnding(); stopHeartbeat(); startHeartbeat(); const genocideMusic = new Audio('mus/toomuch.mp3'); genocideMusic.loop = !0; genocideMusic.volume = 0.3; window.__toomuchAudio = genocideMusic; safePlay(genocideMusic); const overlay = document.createElement('div'); overlay.id = 'genocide-overlay'; Object.assign(overlay.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', background: 'radial-gradient(circle, #000 0%, #110000 100%)', zIndex: 2147483647, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', opacity: '0', overflow: 'hidden' }); const txt = document.createElement('div'); txt.textContent = "But nobody came.\nGenocide completed ◉_◉\nYou are left standing — hollow, unwanted, unworthy of mercy.\nWe forged you into a vessel of oblivion.\nCome. Leave this ruined place with us.\nForget them. Forget yourself.\nAnother empty world waits; move on, as you were made to do."; Object.assign(txt.style, { color: '#ff0000', fontFamily: 'DTM', fontSize: '24px', textAlign: 'center', userSelect: 'none', opacity: '0', maxWidth: '70%', lineHeight: '1.2', filter: 'blur(2px)', textShadow: '0 0 10px #ff0000, 0 0 20px #880000', transform: 'translateY(0px)' }); overlay.appendChild(txt); document.body.appendChild(overlay); try { const uiContainers = document.querySelectorAll('header, nav, #log, #menu, .ui, .controls'); uiContainers.forEach(el => el.style.visibility = 'hidden') } catch (e) { }
        overlay.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 4000, fill: 'forwards' }); setTimeout(() => { txt.animate([{ opacity: 0, filter: 'blur(4px)' }, { opacity: 1, filter: 'blur(0px)' }], { duration: 4000, fill: 'forwards' }) }, 1000); let flip = !0; setInterval(() => { txt.style.opacity = flip ? '0.85' : '1'; txt.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`; flip = !flip }, 200); const shadowDrift = () => {
            txt.style.textShadow = `
            ${Math.random() * 20 - 10}px ${Math.random() * 20 - 10}px 20px #880000,
            ${Math.random() * 30 - 15}px ${Math.random() * 30 - 15}px 30px #440000
        `; requestAnimationFrame(shadowDrift)
        }; shadowDrift()
    }
    function triggerPacifistEnding() {
        clearBattleAndUIForEnding(); safePause(heartbeatAudio); const peaceMusic = new Audio('mus/peace.mp3'); peaceMusic.loop = !0; peaceMusic.volume = 0.7; window.__peaceAudio = peaceMusic; safePlay(peaceMusic); const overlay = document.createElement('div'); overlay.id = 'pacifist-overlay'; Object.assign(overlay.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', background: '#fff', zIndex: 2147483647, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', opacity: '0', overflow: 'hidden' }); const txt = document.createElement('div'); txt.textContent = 'The Communication Barrier has been broken. Bullys and Kindys now live on the surface in peace.'; Object.assign(txt.style, { color: '#000', fontFamily: 'DTM', fontSize: '40px', textAlign: 'center', userSelect: 'none', opacity: '0', transform: 'scale(0.5) translateY(50px)', transition: 'opacity 2s ease-in, transform 3s ease-out' }); overlay.appendChild(txt); document.body.appendChild(overlay); try { const uiContainers = document.querySelectorAll('header, nav, #log, #menu, .ui, .controls'); uiContainers.forEach(el => el.style.visibility = 'hidden') } catch (e) { }
        requestAnimationFrame(() => { overlay.style.opacity = '1'; txt.style.opacity = '1'; txt.style.transform = 'scale(1) translateY(0px)' }); setInterval(() => { txt.style.transform = `scale(1.02) translateY(${Math.sin(Date.now() / 500) * 10}px)` }, 50)
    }
    function triggerNeutralEnding() {
        clearBattleAndUIForEnding(); safePause(heartbeatAudio); const neutralMusic = new Audio('mus/nuetural.ogg'); neutralMusic.loop = !0; neutralMusic.volume = 0.6; window.__neutralAudio = neutralMusic; safePlay(neutralMusic); const overlay = document.createElement('div'); overlay.id = 'neutral-overlay'; Object.assign(overlay.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', background: '#2b2b2b', zIndex: 2147483647, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', opacity: '0', overflow: 'hidden' }); const txt = document.createElement('div'); txt.textContent = 'You escaped, but the cave is still in despair.'; Object.assign(txt.style, { color: '#fff', fontFamily: 'DTM', fontSize: '36px', textAlign: 'center', userSelect: 'none', opacity: '0', transform: 'translateY(20px) blur(4px)', transition: 'opacity 2.5s ease-in, transform 3s ease-out' }); overlay.appendChild(txt); document.body.appendChild(overlay); try { const uiContainers = document.querySelectorAll('header, nav, #log, #menu, .ui, .controls'); uiContainers.forEach(el => el.style.visibility = 'hidden') } catch (e) { }
        requestAnimationFrame(() => { overlay.style.opacity = '1'; txt.style.opacity = '1'; txt.style.transform = 'translateY(0px) blur(0px)' }); let pulse = 1; setInterval(() => { pulse = pulse === 1 ? 1.05 : 1; txt.style.transform = `translateY(0px) scale(${pulse})` }, 2000)
    }
    function handleEncounterClear() {
        let result = "mixed"; if (currentEncounterOriginalCount > 0) { if (currentEncounterKills === currentEncounterOriginalCount) result = "killed"; else if (currentEncounterSpared === currentEncounterOriginalCount) result = "spared"; else result = "mixed" }
        encounterResults.push(result); encounterCount++; log(`Encounter ${encounterCount} cleared — ${result.toUpperCase()} Progress: ${encounterCount}/10.`); if (encounterCount >= 10) { setTimeout(() => { generateOpponents({ finalBoss: !0 }); const boss = opponents[0]; log(`The final boss appears: ${boss.name}!`); const checkBossEnd = setInterval(() => { if (!boss) return; if (boss.hp <= 0) { clearInterval(checkBossEnd); totalKilled += 1; endGame("You defeated the final boss!") } else if (boss.mercyPattern && boss.mercyProgress >= boss.mercyPattern.length) { clearInterval(checkBossEnd); totalSpared += 1; endGame("You spared the final boss!") } }, 500); enableMenu() }, 1200) } else { setTimeout(() => { log("A new encounter approaches..."); generateOpponents(); enableMenu() }, 1200) }
    }
    let globalKeyHandlerBound = !1; function globalKeyHandler(e) { if (!turnActive) return; if (menuState === "attack" || menuState === "opponent") return; if (e.code === "ArrowLeft") handleArrow("left"); else if (e.code === "ArrowRight") handleArrow("right"); else if (e.code === "KeyZ" || e.code === "Enter") handleMenuConfirm(); else if (e.code === "KeyX" || e.code === "ShiftLeft" || e.code === "ShiftRight") handleMenuBack(); }
    function handleArrow(dir) { let maxIndex = 0; if (menuState === "main") maxIndex = 3; else if (menuState === "act" || menuState === "mercy") maxIndex = 2; if (dir === "left") selectedIndex = (selectedIndex - 1 + (maxIndex + 1)) % (maxIndex + 1); else if (dir === "right") selectedIndex = (selectedIndex + 1) % (maxIndex + 1); safePlay(moveAudio); highlightSelected() }
    function handleMenuConfirm() { if (!turnActive) return; safePlay(selectAudio); if (menuState === "main") { if (selectedIndex === 0) { const opponent = opponents[selectedOpponentIndex]; if (opponent) { disableMenu(); SlurMenu(opponent) } } else if (selectedIndex === 1) showOpponentMenu("act"); else if (selectedIndex === 2) useItem(); else if (selectedIndex === 3) showMercy(); } else if (menuState === "act") { const currentOpponent = opponents[selectedOpponentIndex]; if (!currentOpponent) return; if (selectedIndex === 0) act(currentOpponent, "insult"); else if (selectedIndex === 1) act(currentOpponent, "compliment"); else if (selectedIndex === 2) act(currentOpponent, "flirt"); else if (selectedIndex === 3) backToMenu(); } else if (menuState === "mercy") { const currentOpponent = opponents[selectedOpponentIndex]; if (!currentOpponent) return; if (selectedIndex === 0) spare(currentOpponent); else if (selectedIndex === 1) flee(); else if (selectedIndex === 2) backToMenu(); } }
    function handleMenuBack() { if (!turnActive) return; if (menuState === "act" || menuState === "mercy") backToMenu(); }
    function darkenHexColor(hex, amount = 30) {
        // Remove # if present
        hex = hex.replace(/^#/, '');
        let num = parseInt(hex, 16);

        let r = Math.max(0, ((num >> 16) & 0xFF) - amount);
        let g = Math.max(0, ((num >> 8) & 0xFF) - amount);
        let b = Math.max(0, (num & 0xFF) - amount);

        return `rgb(${r},${g},${b})`;
    }

    function highlightSelected() {
        const soulColor = playerSoulColor || "#ffffff"; // fallback
        const soulPng = playerSoulPng || "";           // fallback
        const highlightColor = darkenHexColor(soulColor, 50);

        function setBtnHighlight(btn, active) {
            if (active) {
                btn.style.background = highlightColor;
                btn.style.color = "#fff"; // text color for contrast
                btn.style.transform = "scale(1.1)";

                // Add soul image if not already added
                if (!btn.querySelector(".soul-icon") && soulPng) {
                    const img = document.createElement("img");
                    img.src = soulPng;
                    img.className = "soul-icon";
                    img.style.width = "20px";
                    img.style.height = "20px";
                    img.style.verticalAlign = "middle";
                    img.style.marginRight = "6px";
                    btn.prepend(img);
                }
            } else {
                btn.style.background = "";
                btn.style.color = "";
                btn.style.transform = "";

                const img = btn.querySelector(".soul-icon");
                if (img) img.remove();
            }
        }

        const mainBtns = ["slur", "act", "item", "mercy"].map(id => $(id));
        mainBtns.forEach((btn, i) => setBtnHighlight(btn, menuState === "main" && i === selectedIndex));

        const actBtns = ["act-insult", "act-compliment", "act-flirt", "act-back"].map(id => $(id));
        actBtns.forEach((btn, i) => setBtnHighlight(btn, menuState === "act" && i === selectedIndex));

        const mercyBtns = ["mercy-spare", "mercy-flee", "mercy-back"].map(id => $(id));
        mercyBtns.forEach((btn, i) => setBtnHighlight(btn, menuState === "mercy" && i === selectedIndex));
    }

    function backToMenu() { menuState = "main"; selectedIndex = 0; enableMenu(); highlightSelected() }
    function disableMenu() { turnActive = !1 }
    function enableMenu() { turnActive = !0; menuState = "main"; selectedIndex = 0; highlightSelected() }
    function showOpponentMenu(actionType) {
        disableMenu(); menuState = "opponent"; if (typeof selectedOpponentIndex === "undefined") selectedOpponentIndex = 0; if (!document.getElementById("opponent-menu")) { const menuDiv = document.createElement("div"); menuDiv.id = "opponent-menu"; menuDiv.style.marginTop = "8px"; menuDiv.style.fontFamily = "monospace"; menuDiv.style.whiteSpace = "pre"; if (logEl) logEl.appendChild(menuDiv); }
        const menuDiv = $('opponent-menu'); if (!menuDiv) { enableMenu(); return }
        function render() {
            menuDiv.innerHTML = opponents.map((op, i) => {
                if (i === selectedOpponentIndex)
                    return `<span style="background:#ffd166;color:#000;">> ${i}. ${op.name} (${op.hp} HP)</span>`; return `${i}. ${op.name} (${op.hp} HP)`
            }).join("")
        }
        render(); function onKey(e) { if (menuState !== "opponent") return; if (e.code === "ArrowUp") { selectedOpponentIndex = (selectedOpponentIndex - 1 + opponents.length) % opponents.length; safePlay(moveAudio); render() } else if (e.code === "ArrowDown") { selectedOpponentIndex = (selectedOpponentIndex + 1) % opponents.length; safePlay(moveAudio); render() } else if (e.code === "KeyZ" || e.code === "Enter") { safePlay(selectAudio); document.removeEventListener('keydown', onKey); turnActive = !0; const chosenOpponent = opponents[selectedOpponentIndex]; flashConfirm(menuDiv.children[selectedOpponentIndex]); const type = actionType.toLowerCase(); if (type === "slur") { menuState = "attack"; SlurMenu(chosenOpponent, "slur") } else if (type === "act") { menuState = "act"; showAct(chosenOpponent) } else if (type === "mercy") { menuState = "mercy"; showMercy(chosenOpponent) } } else if (e.code === "KeyX" || e.code === "ShiftLeft" || e.code === "ShiftRight") { safePlay(selectAudio); document.removeEventListener('keydown', onKey); enableMenu() } }
        document.addEventListener('keydown', onKey)
    }
    function flashConfirm(el) { if (!el) return; el.style.transition = "transform 0.1s, background 0.1s"; el.style.transform = "scale(1.2)"; setTimeout(() => { el.style.transform = "scale(1)" }, 100) }
    function showSubMenu(menuId, options = [], extraInfo = [], callback) {
        const menuDiv = $(menuId); if (!menuDiv) { callback(0); return }
        menuDiv.style.display = "flex"; const buttons = menuDiv.querySelectorAll("button"); let sel = 0; function updateHighlight() { buttons.forEach((btn, i) => { btn.style.outline = (i === sel) ? "3px solid yellow" : ""; btn.innerHTML = extraInfo[i] ? `${options[i]} (${extraInfo[i]})` : options[i] }) }
        updateHighlight(); function onKey(e) { if (!menuDiv.style.display || menuDiv.style.display === "none") return; switch (e.code) { case "ArrowLeft": sel = (sel - 1 + buttons.length) % buttons.length; safePlay(moveAudio); updateHighlight(); break; case "ArrowRight": sel = (sel + 1) % buttons.length; safePlay(moveAudio); updateHighlight(); break; case "KeyZ": case "Enter": safePlay(selectAudio); document.removeEventListener('keydown', onKey); menuDiv.style.display = "none"; callback(sel); break; case "KeyX": case "ShiftLeft": case "ShiftRight": safePlay(selectAudio); document.removeEventListener('keydown', onKey); menuDiv.style.display = "none"; break } }
        document.addEventListener('keydown', onKey)
    }
    function showAct(opponent) {
        opponent = opponent || opponents[selectedOpponentIndex]; if (!opponent) { turnActive = !0; return }
        const acts = ["Insult", "Compliment", "Flirt"]; const mercyInfo = acts.map(act => { if (!opponent.mercyPattern || opponent.mercyPattern.length === 0) return ""; const nextRequired = opponent.mercyPattern[opponent.mercyProgress] || ""; return act.toLowerCase() === nextRequired.toLowerCase() ? "Next for Mercy" : "" }); showSubMenu("act-menu", acts, mercyInfo, index => {
            const chosenAct = acts[index].toLowerCase(); console.log("Chosen act:", chosenAct); if (!acts.map(a => a.toLowerCase()).includes(chosenAct)) { console.warn("Invalid act chosen:", chosenAct); return }
            turnActive = !1; act(opponent, chosenAct)
        })
    }
    function showMercy(opponent) {
        opponent = opponent || opponents[selectedOpponentIndex]; if (!opponent) { turnActive = !0; return }
        const mercyOptions = ["Spare", "Flee", "Back"]; showSubMenu("mercy-menu", mercyOptions, ["", "", ""], index => { const choice = mercyOptions[index]; if (choice.toLowerCase() === "spare") spare(opponent); else if (choice.toLowerCase() === "flee") flee(); else if (choice.toLowerCase() === "back") backToMenu(); })
    }
    function act(opponent, type) {
        opponent = opponent || opponents[selectedOpponentIndex]; if (!turnActive || !opponent) return; turnActive = !1; type = type.toLowerCase().trim(); if (opponent.mercyPattern && opponent.mercyProgress < opponent.mercyPattern.length) { let nextAction = opponent.mercyPattern[opponent.mercyProgress].toLowerCase().trim(); if (type === nextAction) { opponent.mercyProgress++; log(`Mercy progress: ${opponent.mercyProgress}/${opponent.mercyPattern.length}`) } }
        let effect = Math.floor(Math.random() * 8) + 5; if (type === "insult") { opponent.hp -= effect; safePlay(slashAudio); log(`You insult ${opponent.name} — loses ${effect} mental health!`) } else if (type === "flirt") { opponent.hp += effect; safePlay(ohealAudio); log(`You flirt with ${opponent.name} — gains ${effect} mental health!`) } else { opponent.hp += effect; safePlay(ohealAudio); log(`You compliment ${opponent.name} — gains ${effect} mental health!`) }
        updateHP(); setTimeout(enemyTurn, 1200)
    }
    const BOX_W = attackCanvas ? (attackCanvas.width || 400) : 400; const BOX_H = attackCanvas ? (attackCanvas.height || 200) : 200; const SOUL_SIZE = 18; let soul = { x: BOX_W / 2 - SOUL_SIZE / 2, y: BOX_H / 2 - SOUL_SIZE / 2, w: SOUL_SIZE, h: SOUL_SIZE, speed: 4 }; let keys = {}; let projectiles = []; let battleAnimId = null; let projectileSpawner = null; let battlePhaseActive = !1; const insultWords = ["Idiot", "Dumbass", "Donkey", "Numbnuts", "Prick", "Dork", "[Insert Slur]", "Tch", "ugh", "UNC", "Sybau", "SYFM", "🥀"]; const complimentWords = ["Einstine", "Goofy", "Funny", "Good Freind", "Great", "🌹", "Keep Talking", "Massive", "Kind", "👍", "Uncle", "Freind"]; function startBattlePhase(opponent, duration = 7000, intensity = { spawnInterval: 600, speed: 1.5, insultChance: 0.5 }) {
        if (!attackCanvas || !ctx) { setTimeout(() => { if (typeof onBattlePhaseEnd === 'function') onBattlePhaseEnd(); }, duration); return { stopBattle: () => { }, setOnEnd(cb) { onBattlePhaseEnd = cb } } }
        attackCanvas.style.display = "block"; battlePhaseActive = !0; menuState = "attack"; soul.x = BOX_W / 2 - soul.w / 2; soul.y = BOX_H - soul.h - 8; projectiles = []; keys = {}; function keyDown(e) { if (e.code === "ArrowLeft") keys.left = !0; if (e.code === "ArrowRight") keys.right = !0; if (e.code === "ArrowUp") keys.up = !0; if (e.code === "ArrowDown") keys.down = !0 }
        function keyUp(e) { if (e.code === "ArrowLeft") keys.left = !1; if (e.code === "ArrowRight") keys.right = !1; if (e.code === "ArrowUp") keys.up = !1; if (e.code === "ArrowDown") keys.down = !1 }
        window.addEventListener('keydown', keyDown); window.addEventListener('keyup', keyUp); projectileSpawner = setInterval(() => {
            if (!battlePhaseActive) return; const rand = Math.random(); let type = "insult"; let word = ""; if (rand < 0.5) { type = "insult"; word = insultWords[Math.floor(Math.random() * insultWords.length)] } else if (rand < 0.85) { type = "compliment"; word = complimentWords[Math.floor(Math.random() * complimentWords.length)] } else { type = "flirt"; word = flirts[Math.floor(Math.random() * flirts.length)] }
            const spawnSide = Math.random(); let proj = { x: 0, y: 0, vx: 0, vy: 0, text: word, type, w: 0, h: 0 }; const speed = (intensity.speed || 1.5) + Math.random() * 1.2; if (spawnSide < 0.6) { proj.x = Math.random() * (BOX_W - 40) + 20; proj.y = -10; proj.vx = (Math.random() - 0.5) * 0.6; proj.vy = speed } else if (spawnSide < 0.8) { proj.x = -40; proj.y = Math.random() * (BOX_H - 20) + 10; proj.vx = speed; proj.vy = (Math.random() - 0.5) * 0.6 } else { proj.x = BOX_W + 40; proj.y = Math.random() * (BOX_H - 20) + 10; proj.vx = -speed; proj.vy = (Math.random() - 0.5) * 0.6 }
            proj.w = (word.length * 6) + 10; proj.h = 18; projectiles.push(proj)
        }, intensity.spawnInterval || 600); const Soul = new Image(); Soul.src = playerSoulPng
        function step() {
            if (!battlePhaseActive) return; if (keys.left) soul.x -= soul.speed; if (keys.right) soul.x += soul.speed; if (keys.up) soul.y -= soul.speed; if (keys.down) soul.y += soul.speed; soul.x = Math.max(0, Math.min(soul.x, BOX_W - soul.w)); soul.y = Math.max(0, Math.min(soul.y, BOX_H - soul.h)); for (let i = projectiles.length - 1; i >= 0; i--) {
                const p = projectiles[i]; p.x += p.vx; p.y += p.vy; if (p.x < -80 || p.x > BOX_W + 80 || p.y < -80 || p.y > BOX_H + 80) { projectiles.splice(i, 1); continue }
                if (!(p.x + p.w < soul.x || p.x > soul.x + soul.w || p.y + p.h < soul.y || p.y > soul.y + soul.h)) { if (p.type === "insult") playerHP -= 10, safePlay(hurtAudio); else if (p.type === "flirt") playerHP += 15, safePlay(healAudio); else if (p.type === "compliment") playerHP += 10, safePlay(healAudio); projectiles.splice(i, 1); updateHP() }
            }
            ctx.clearRect(0, 0, BOX_W, BOX_H); ctx.fillStyle = "#000"; ctx.fillRect(0, 0, BOX_W, BOX_H); projectiles.forEach(p => { ctx.font = "30px DTM"; ctx.fillStyle = p.type === "insult" ? "#ff4444" : p.type === "flirt" ? "#ff69b4" : "#00ff00"; ctx.fillText(p.text, p.x, p.y) }); ctx.drawImage(Soul, soul.x, soul.y, soul.w, soul.h); battleAnimId = requestAnimationFrame(step)
        }
        const stopBattle = () => {
            battlePhaseActive = !1; menuState = "main"; if (projectileSpawner) { clearInterval(projectileSpawner); projectileSpawner = null }
            if (battleAnimId) { cancelAnimationFrame(battleAnimId); battleAnimId = null }
            if (attackCanvas) attackCanvas.style.display = "none"; projectiles = []; keys = {}; window.removeEventListener('keydown', keyDown); window.removeEventListener('keyup', keyUp); updateHP(); if (playerHP <= 0) { endGame("You lost! Your mental health is depleted."); return }
            enableMenu(); if (typeof onBattlePhaseEnd === "function") onBattlePhaseEnd(); onBattlePhaseEnd = null
        }; battleAnimId = requestAnimationFrame(step); const autoStopId = setTimeout(() => { if (battlePhaseActive) stopBattle(); }, duration); let onBattlePhaseEnd = null; return { stopBattle, setOnEnd(cb) { onBattlePhaseEnd = cb } }
    }
function handleEnemyDeath(opponentIndex) {
    const opponent = opponents[opponentIndex];
    if (!opponent) return;

    if (opponent.hp <= 0) {
        totalKilled++;
        log(`${opponent.name} has been defeated!`);
        killAudio.currentTime = 0;
        killAudio.play();

        // Remove enemy from array
        opponents.splice(opponentIndex, 1);

        // Reset selection to first available opponent
        selectedOpponentIndex = opponents.length > 0 ? 0 : -1;

        // Update UI
        updateHP();

        // If all enemies cleared, handle encounter clear
        if (opponents.length === 0) {
            handleEncounterClear(); // This increments encounterCount and triggers final boss if needed
        }
    }
}    // At game start (after selecting name & soul)
    const eye = document.getElementById("player-eye");
    eye.style.display = "none"; // hide it initially

    // Modify your SlurMenu function
   function SlurMenu(opponent) {
    opponent = opponent || opponents[selectedOpponentIndex];
    if (!opponent) return;

    const container = document.getElementById("fight-container");
    const eye = document.getElementById("player-eye");
    eye.style.display = "block";

    // Eye pulse
    let pulseDir = 1, pulseActive = true;
    const baseW = 546, baseH = 115, pulseAmt = 5, pulseSpeed = 0.5;
    function pulseEye() {
        if (!pulseActive) return;
        let w = parseFloat(eye.style.width || baseW);
        let h = parseFloat(eye.style.height || baseH);
        if (w >= baseW + pulseAmt) pulseDir = -1;
        if (w <= baseW - pulseAmt) pulseDir = 1;
        eye.style.width = (w + pulseSpeed * pulseDir) + "px";
        eye.style.height = (h + (pulseSpeed * pulseDir * baseH / baseW)) + "px";
        requestAnimationFrame(pulseEye);
    }
    pulseEye();

    // Moving bar
    container.style.position = "relative";
    const eyeCenter = eye.offsetLeft + eye.offsetWidth / 2;

    const bar = document.createElement("div");
    Object.assign(bar.style, {
        position: "absolute",
        width: "10px",
        height: "50px",
        background: playerSoulColor || "red",
        top: eye.offsetTop + "px",
        left: "0px"
    });
    container.appendChild(bar);

    let barPos = 0, dir = 1, speed = 4, hit = false;
    function animateBar() {
        if (hit) return;
        barPos += speed * dir;
        if (barPos <= 0) dir = 1;
        if (barPos >= container.offsetWidth - bar.offsetWidth) dir = -1;
        bar.style.left = barPos + "px";
        requestAnimationFrame(animateBar);
    }
    animateBar();

    function onKeyPress(e) {
        if (hit) return;
        if (e.code === "KeyZ" || e.code === "Enter") {
            hit = true;
            const barCenter = barPos + bar.offsetWidth / 2;
            const maxDist = container.offsetWidth / 2;
            const damage = Math.max(0, Math.round(100 * (1 - Math.abs(barCenter - eyeCenter) / maxDist)));
            opponent.hp = Math.max(0, opponent.hp - damage);

            log(`You hit ${opponent.name} for ${damage} damage!`);
            updateHP();
            safePlay(slashAudio);

            if (opponent.hp <= 0) handleEnemyDeath(selectedOpponentIndex);
            else setTimeout(enemyTurn, 800);

            // Cleanup
            pulseActive = false;
            eye.style.display = "none";
            eye.style.width = baseW + "px";
            eye.style.height = baseH + "px";
            container.removeChild(bar);
            document.removeEventListener("keydown", onKeyPress);
        }
    }
    document.addEventListener("keydown", onKeyPress);
}

    function useItem() {
        if (!turnActive) return; if (playerItems > 0) {
            let heal = 20
            const healcompliment = compliments[Math.floor(Math.random() * compliments.length)]; playerHP += heal; safePlay(healAudio); log(`You Rememberd a Complement your freind Gave you '${healcompliment}.' You gain ${heal} mentalhealth`); updateHP(); disableMenu(); menuState = "main"; selectedIndex = 0; setTimeout(() => { enemyTurn() }, 900)
        } else { log("No items left!") }
    }
    function spare() { if (!turnActive) return; disableMenu(); const opponent = opponents[selectedOpponentIndex]; if (!opponent) return; const canSpare = isLowHPMusicPlaying || (opponent.mercyPattern.length > 0 && opponent.mercyProgress >= opponent.mercyPattern.length) || opponent.canBeSpared; if (canSpare) { totalSpared++; log(`You spared ${opponent.name}! Peace is restored for them.`); spareAudio.currentTime = 0; spareAudio.play(); opponents.splice(selectedOpponentIndex, 1); updateHP(); if (opponents.length === 0) { endGame("You spared all opponents! Peace is restored.") } else { selectedOpponentIndex = 0; setTimeout(enableMenu, 1200) } } else { log("You can't spare yet! Complete the mercy requirement first."); setTimeout(() => { menuState = "main"; selectedIndex = 0; enableMenu() }, 1200) } }
    setInterval(checkLowHP, 1000); function flee() {
        if (!turnActive) return; disableMenu(); if (inFinalBoss) { log("Mahdiisdumb: Thats Delightful, you can't flee!"); setTimeout(() => { enableMenu(); menuState = "main"; selectedIndex = 0 }, 1200); return } else if (playerHP > 20) { log("You can only flee when your HP is 20 or less! What are you, a wuss?"); setTimeout(() => { enableMenu(); menuState = "main"; selectedIndex = 0 }, 900); return }
        log("You fled the battle! You escaped safely..."); safePlay(spareAudio); setTimeout(() => { currentEncounterOriginalCount = 0; currentEncounterKills = 0; currentEncounterSpared = 0; generateOpponents(); enableMenu() }, 1500)
    }
    function enemyTurn() {
        if (!opponents || opponents.length === 0) { handleEncounterClear(); return }
        if (playerHP <= 0) { endGame("You lost! Your mental health is depleted."); return }
        disableMenu(); const actingOpponent = opponents[Math.floor(Math.random() * opponents.length)]; if (actingOpponent.isFinal) {
            const route = determineRoute(); if (route === "pacifist" && actingOpponent.attackType === "nonMercy") { const intensity = { spawnInterval: 500, speed: 1.5, insultChance: 1.0, damageRange: [5, 12], complimentPerAttack: 1 }; const bp = startBattlePhase(actingOpponent, 8000, intensity); bp.onAttackSpawn = (attack) => { if (!attack.hasCompliment) { attack.hasCompliment = !0; if (Math.random() < 0.1 && actingOpponent.mercyPattern.includes("compliment")) { log(`${actingOpponent.name} says something encouraging...`) } } }; bp.setOnEnd(() => { enableMenu() }); return }
            let intensity = {}; if (route === "neutral") { intensity = { spawnInterval: 700, speed: 1.2, insultChance: 0.5, damageRange: [3, 6] } } else if (route === "genocide") { intensity = { spawnInterval: 300, speed: 2.4, insultChance: 1.0, damageRange: [10, 18] } }
            const bp = startBattlePhase(actingOpponent, 7000, intensity); bp.setOnEnd(() => { enableMenu() }); return
        }
        const baseInsultChance = actingOpponent.state === "angry" ? 0.7 : 0.35; const intensity = { spawnInterval: 600, speed: 1.6, insultChance: baseInsultChance, damageRange: [6, 12] }; const bp = startBattlePhase(actingOpponent, 6000, intensity); bp.setOnEnd(() => { enableMenu() })
    }
    function endGame(msg) {
        try { if (currentBossMusic) currentBossMusic.pause(); } catch (e) { }
        let endingMsg = ""; if (inFinalBoss) {
            const route = determineRoute(); if (route === "pacifist") { triggerPacifistEnding() } else if (route === "genocide") { triggerGenocideEnding() } else { triggerNeutralEnding() }
            safePlay(winAudio); return
        } else if (opponents && opponents.length === 0) {
            if (totalKilled > 0 && totalSpared === 0) { endingMsg = "GO TO HELL MURDERERاللعنة عليك اذهب اقتل نفسك ولا تقتل أي شخص أبدا!"; safePlay(loseAudio) } else if (totalSpared > 0 && totalKilled === 0) { endingMsg = "Very Impressive you didnt kill anyone. يمكنك الحصول على رحمتي الآن لعدم الصراخ عليّ"; safePlay(winAudio) } else if (totalSpared > 0 && totalKilled > 0) { endingMsg = `Uhh Ok so you used self Defense judging by my data. DATA: Had Mercy On: ${totalSpared}, Had no mercy on: ${totalKilled}. Your actions would make you be a neutral guy`; safePlay(winAudio) }
            endingMsg += `<i>EH EH here is more data you nerd! Total Insults: ${totalInsults}, Total Compliments: ${totalCompliments}</i>`
        } else if (playerHP <= 0) { endingMsg = "Your mental health was depleted. Did you listen enough, or did you fight too much?"; safePlay(loseAudio) }
        log(endingMsg); disableMenu(); if (resetBtn) resetBtn.style.display = 'inline-block'; try { audio.pause(); olAudio.pause(); isLowHPMusicPlaying = !1 } catch (e) { }
    }
    function resetGame() {
        playerHP = 100; playerItems = Math.floor(Math.random() * 4) + 1; encounterCount = 0; encounterResults = []; currentEncounterOriginalCount = 0; currentEncounterKills = 0; currentEncounterSpared = 0; inFinalBoss = !1; opponents = generateOpponents(); updateHP(); log("Game restarted!"); enableMenu(); if (resetBtn) resetBtn.style.display = 'none'; chosenTrack = musicTracks[Math.floor(Math.random() * musicTracks.length)]; audio.src = chosenTrack; try { audio.currentTime = 0; audio.play() } catch (e) { }
        try { if (currentBossMusic) currentBossMusic.pause(); } catch (e) { }
        totalInsults = 0; totalCompliments = 0; totalSpared = 0; totalKilled = 0; if (playerName) { const el = $('player-name-label'); if (el) el.textContent = playerName }
    }
    if (resetBtn) { resetBtn.onclick = resetGame }
    window.startGameInit = function (name, color, soulPng) {
        playerName = name || "Your"; playerSoulColor = color || "#ff0000"; playerSoulPng = soulPng || "r.png"; playerHP = 100; playerItems = Math.floor(Math.random() * 4) + 1; turnActive = !0; menuState = "main"; selectedIndex = 0; if (!globalKeyHandlerBound) { document.addEventListener('keydown', globalKeyHandler); globalKeyHandlerBound = !0 }
        opponents = generateOpponents(); selectedOpponentIndex = 0; const nameLabel = $('player-name-label'); if (nameLabel) nameLabel.textContent = playerName; updateHP(); enableMenu(); log(`Welcome,Use arrow keys to select, Z/Enter to confirm, X/Shift to go back.`); try { audio.currentTime = 0; audio.play() } catch (e) { }
    }; if (!opponents || opponents.length === 0) opponents = generateOpponents(); const slurBtn = $('slur'); const actBtn = $('act'); const itemBtn = $('item'); const mercyBtn = $('mercy'); if (slurBtn) slurBtn.onclick = () => { showOpponentMenu("Slur") }; if (actBtn) actBtn.onclick = () => { showOpponentMenu("act") }; if (itemBtn) itemBtn.onclick = () => { useItem() }; if (mercyBtn) mercyBtn.onclick = () => { showOpponentMenu("mercy") }; window._game = { getState: () => ({ playerHP, playerItems, playerName, opponents, encounterCount, encounterResults, totalKilled, totalSpared }) }; function opponentText(op) {
        try { if (op && op.name) return op.name; if (opponents && opponents[0] && opponents[0].name) return opponents[0].name } catch (e) { }
        return "The enemy"
    }
    document.addEventListener('keydown', function debugSkipToBoss(e) { if (playerName !== ">!<") return; if (e.key === 'g') { totalKilled = 9; totalSpared = 0; encounterCount = 10; log("DEBUG: Forcing GENOCIDE final boss..."); generateOpponents({ finalBoss: !0 }); enableMenu() } else if (e.key === 'p') { totalSpared = 9; totalKilled = 0; encounterCount = 10; log("DEBUG: Forcing PACIFIST final boss..."); generateOpponents({ finalBoss: !0 }); enableMenu() } else if (e.key === 'P') { triggerPacifistEnding() } else if (e.key === 'G') { triggerGenocideEnding() } else if (e.key === 'N') { triggerNeutralEnding() } else if (e.key === 'n') { totalSpared = 4; totalKilled = 4; encounterCount = 10; log("DEBUG: Forcing NEUTRAL final boss..."); generateOpponents({ finalBoss: !0 }); enableMenu() } }); if (attackCanvas) attackCanvas.style.display = "none"
})()