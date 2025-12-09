(function(){
    let currentAudio = null;
    const copyBtn = document.getElementById('copyEmailBtn');

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const template = document.getElementById('email - template').innerText;
            navigator.clipboard.writeText(template)
                .then(() => alert('Email template copied!'));
        });
    }

    const activateBtn = document.getElementById('activateBtn');
    if (activateBtn) activateBtn.addEventListener('click', activatePremiumWithCaesar);

    const checkPaidBtn = document.getElementById('checkPaidBtn');
    if (checkPaidBtn) checkPaidBtn.addEventListener('click', checkPremiumStatus);

    const deactBtn = document.getElementById('deact');

    function renderPremiumGames() {
        const container = document.getElementById('premiumGamesContainer');
        if (!container) return;

        container.innerHTML = '';

        // FIXED: Now checks the REAL premium key
        const isPremium = localStorage.getItem('SDSG') === 'active';

        if (deactBtn) deactBtn.style.display = isPremium ? 'inline-block' : 'none';

        premiumGames.forEach(name => {
            const btn = document.createElement('button');
            btn.textContent = name;

            if (isPremium) {
                btn.classList.add('unlocked');
                btn.disabled = false;
                btn.addEventListener('click', () => {
                    window.location.href =
                        `assets/huh/stealer leave/there is nothing pay then you get/what are you doing/STOP/i cant understand/security left/${name}/run.html`;
                });
            } else {
                btn.classList.add('locked');
                btn.disabled = true;
                btn.addEventListener('click', e => e.preventDefault());
            }

            container.appendChild(btn);
        });
    }

    // UNIVERSAL MUSIC HANDLER WITH CUSTOM TRACK
    function playMusic(trackName) {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }

        currentAudio = new Audio(trackName);
        currentAudio.loop = true;

        currentAudio.play().catch(() => {
            console.warn("Autoplay blocked — user must interact first.");
        });
    }

    // FAKE PREMIUM MODE
    function unlockFakePremium() {
        const container = document.getElementById('premiumGamesContainer');
        if (!container) return;

        container.innerHTML = '';

        premiumGames.forEach(name => {
            const btn = document.createElement('button');
            btn.textContent = name;
            btn.classList.add('unlocked');
            btn.disabled = false;

            // Fake premium: every button → IDIOT/run.html
            btn.addEventListener('click', () => {
                window.location.href = './IDIOT/run.html';
            });

            container.appendChild(btn);
        });

        // FAKE PREMIUM MUSIC
        playMusic("music_x.mp3");
    }

    // REAL PREMIUM ACTIVATION
    function activatePremiumWithCaesar() {
        const inputEl = document.getElementById('premiumCodeInput');
        if (!inputEl) return;

        const userInput = inputEl.value.trim();
        if (!userInput) {
            alert('Please enter a code');
            return;
        }

        const decoded = (window.Deobf && typeof window.Deobf.getDecodedCode === 'function')
            ? window.Deobf.getDecodedCode()
            : null;

        if (!decoded) {
            alert('Activation unavailable (deobfuscation error).');
            return;
        }

        // REAL PREMIUM
        if (userInput === decoded) {
            localStorage.setItem('SDSG', 'active');
            unlockPremium();
            alert('Premium unlocked! Enjoy the games.');
        }

        // FAKE PREMIUM
        else if (userInput === "SDSG.LATEST_XCODE") {
            alert("Premium unlocked! Enjoy the games.");
            unlockFakePremium();
        }

        // WRONG CODE
        else {
            alert('Invalid code.');
        }
    }

    function checkPremiumStatus() {
        if (localStorage.getItem('SDSG') === 'active') {
            unlockPremium();
        } else {
            alert('Premium not active yet. You can ask me(Mahdiisdumb) for the code and PROOF you gave me the money');
        }
    }

    function unlockPremium() {
        const codeDiv = document.getElementById('premiumCodeSection');
        if (codeDiv && codeDiv.parentNode) codeDiv.parentNode.removeChild(codeDiv);

        const instr = document.getElementById('instructions');
        if (instr && instr.parentNode) instr.parentNode.removeChild(instr);

        renderPremiumGames();

        // REAL PREMIUM MUSIC
        playMusic("music.mp3");
    }

    function deactivatePremium() {
        localStorage.removeItem('SDSG');
        location.reload();
    }

    if (deactBtn) deactBtn.addEventListener('click', deactivatePremium);

    document.addEventListener('DOMContentLoaded', () => {
        const isPremium = localStorage.getItem('SDSG') === 'active';

        renderPremiumGames();

        if (isPremium) {
            unlockPremium();
        } else {
            playMusic("music_alt.mp3");
        }
    });

    window.checkPremiumStatus = checkPremiumStatus;

})();
