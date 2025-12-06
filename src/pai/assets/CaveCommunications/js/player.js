const nameScreen = document.getElementById('naming-screen');
const soulScreen = document.getElementById('soul-screen');
const gameUI = document.getElementById('game-ui');
const nameInput = document.getElementById('player-name-input');
const soulBtns = Array.from(document.querySelectorAll('.soul-btn'));
const soulConfirmBtn = document.getElementById('soul-confirm-btn');
const eye = document.getElementById('player-eye');

let selectedSoulIndex = 0;
let playerName = '';
let playerSoulColor = '';
let playerSoulPng = '';

// ----------------- Helper Functions -----------------
function showScreen(screen) {
    [nameScreen, soulScreen, gameUI].forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

function updateSoulSelected() {
    const btn = soulBtns[selectedSoulIndex];

    // Remove previous highlights from all buttons
    soulBtns.forEach(b => {
        b.style.border = '2px solid transparent';
        b.style.boxShadow = 'none';
    });

    // Highlight the selected button using its soul color
    const color = btn.dataset.color;
    btn.style.border = `2px solid ${color}`;
    btn.style.boxShadow = `0 0 10px 4px ${color}80`; // semi-transparent glow

    // Update the “Selected” display below
    document.getElementById('soul-selected').innerHTML =
        `<span style="font-size:1.1em;">Selected: </span>
         <img src="${btn.dataset.png}" style="width:32px;height:32px;vertical-align:middle;">`;
}



// ----------------- Keyboard Navigation -----------------
document.addEventListener('keydown', (e) => {

    // ----- Name Screen -----
    if (nameScreen.classList.contains('active')) {
        if (e.key === 'Enter') {
            const nameVal = nameInput.value.trim();
            if (!nameVal) {
                alert("Please enter a name.");
                return;
            }
            playerName = nameVal;
            showScreen(soulScreen);
            selectedSoulIndex = 0;
            soulBtns[selectedSoulIndex].classList.add('selected');
            updateSoulSelected();
            soulConfirmBtn.style.display = "inline-block";
            e.preventDefault();
        }
    }

    // ----- Soul Screen -----
    else if (soulScreen.classList.contains('active')) {

        if (e.key === 'ArrowRight') {
            soulBtns[selectedSoulIndex].classList.remove('selected');
            selectedSoulIndex = (selectedSoulIndex + 1) % soulBtns.length;
            soulBtns[selectedSoulIndex].classList.add('selected');
            updateSoulSelected();
        }
        if (e.key === 'ArrowLeft') {
            soulBtns[selectedSoulIndex].classList.remove('selected');
            selectedSoulIndex = (selectedSoulIndex - 1 + soulBtns.length) % soulBtns.length;
            soulBtns[selectedSoulIndex].classList.add('selected');
            updateSoulSelected();
        }
        if (e.key === 'Enter' || e.key.toLowerCase() === 'z') {
            playerSoulColor = soulBtns[selectedSoulIndex].dataset.color;
            playerSoulPng = soulBtns[selectedSoulIndex].dataset.png;
            showScreen(gameUI);
            eye.style.display = "block";
            document.getElementById('log').innerHTML =
                "Game started! Use arrow keys to navigate menus.";
            if (window.startGameInit) window.startGameInit(playerName, playerSoulColor, playerSoulPng);
        }
        if (e.key.toLowerCase() === 'x' || e.key === 'Shift') {
            // Go back to name screen
            showScreen(nameScreen);
            nameInput.focus();
        }
    }
});

// ----------------- Mouse Click Selection (Optional) -----------------
soulBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        soulBtns[selectedSoulIndex].classList.remove('selected');
        selectedSoulIndex = index;
        btn.classList.add('selected');
        updateSoulSelected();
        soulConfirmBtn.style.display = "inline-block";
    });
});

soulConfirmBtn.addEventListener('click', () => {
    playerSoulColor = soulBtns[selectedSoulIndex].dataset.color;
    playerSoulPng = soulBtns[selectedSoulIndex].dataset.png;
    showScreen(gameUI);
    eye.style.display = "block";
    document.getElementById('log').innerHTML =
        "Game started! Use arrow keys to navigate menus.";
    if (window.startGameInit) window.startGameInit(playerName, playerSoulColor, playerSoulPng);
});
