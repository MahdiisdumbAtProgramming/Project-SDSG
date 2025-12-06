// script.js
document.addEventListener('DOMContentLoaded', function () {
    const buttonsContainer = document.getElementById('buttonsContainer');
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
                window.location.href = './ARG/ARG.html';
            }
        } else {
            // Reset if wrong key pressed
            konamiPosition = 0;
        }
    });
});