// script.js
document.addEventListener('DOMContentLoaded', function () {
    const buttonsContainer = document.getElementById('buttonsContainer');

    // This simulates folder names that we expect to be present in the parent directory
    const games = ['AoOni', 'Appel', 'Arena', 'Bomb-Tag', 'BELTAGOON', 'calc', 'Cave Comunications', 'CeaserCipher', 'Chinese PVZ', 'Click Counter', 'CookieClicker', 'CPS', 'CrazyCattle3D', 'DANK-FLOWEY', 'Diddy', 'echovr2d', 'Fish', 'Flappy Bird', 'Flip A Mean Guy', 'free money!', 'Geomerty Dash (ASS)', 'Goofy Goober', 'Half-Price', 'Kabby Lame Ahh', 'ITU(WIFI)', 'legacy(WIFI)', 'LevelGen', 'Lore', 'Marcord(Wifi)', 'Mario', 'MinecraftOffline', 'music', 'Omega Flowey', 'Pac-Man', 'parry sim', 'PerlinNoise', 'Pics', 'Platformer', 'PREMIUM', 'Ransomware', 'RaycasterEngine', 'RedirectTest', 'Relegious text', 'RenderEngine', 'RisingShepTone', 'SDK TEST', 'Sitetest', 'Slope', 'Snake', 'Snow Rider 3D', 'Soundbuttons', 'SpaceInvaders', 'Tag', 'VoxelTest', 'WEARE1', 'WebProxy(WIFI)', 'WebsiteTest', 'ZombieRaid', 'ZombyecareVsMahdiStudios' ];

    // Create buttons for folders containing run.html
    games.forEach(folder => {
        const button = document.createElement('button');

        // Button action simulates redirecting to run.html of each folder
        button.textContent = folder; // Use folder's name for button label
        button.onclick = () => {
            window.location.href = `${folder}/run.html`; // Redirect to the corresponding run.html file
        };
        
        buttonsContainer.appendChild(button);
    });
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];
    let konamiPosition = 0;

    document.addEventListener('keydown', e => {
        if (e.key === konamiCode[konamiPosition]) {
            konamiPosition++;
            if (konamiPosition === konamiCode.length) {
                // Full Konami code entered!
                window.location.href = './ARG/run.html';
            }
        } else {
            // Reset if wrong key pressed
            konamiPosition = 0;
        }
    });
});