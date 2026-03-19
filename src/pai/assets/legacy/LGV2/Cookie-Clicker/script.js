// script.js
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

// Function to update the score and high score display
function updateDisplay() {
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('highScore').innerText = `High Score: ${highScore}`;
}

// Function to handle button click
function cookieClick() {
    score += 1;  // Increment score by 1 for each click

    // Check if current score is higher than high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);  // Save new high score to localStorage
    }

    updateDisplay();  // Update the displayed score and high score
}

// Add event listener to the button
document.querySelector('.button1').addEventListener('click', cookieClick);

// Initial display update on page load
window.onload = function() {
    updateDisplay();
};
