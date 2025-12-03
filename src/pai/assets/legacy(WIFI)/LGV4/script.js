// script.js
document.addEventListener('DOMContentLoaded', function () {
    const buttonsContainer = document.getElementById('buttonsContainer');

    // This simulates folder names that we expect to be present in the parent directory
    const games = ['Ao Oni', 'Best Music', 'Catch Diddy', 'Cookie Clicker', 'CRYPTIC MESSAGE', 'Fish', 'Flip A Mean guy', 'free money!', 'Goofy Goober', 'Gravity Falls (thisisnotawebsitedotcom.com)', 'Input to URL', 'MOTW', 'Platformer', 'Redirect Test', 'Render Engine', 'Run From Diddy', 'Space Invaders', 'SP Co-op ver', 'Tag', 'TOONS', 'WE ARE #1', 'Webpage Test', 'Zombie Raid', 'ZR CO-OP ver']

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
});