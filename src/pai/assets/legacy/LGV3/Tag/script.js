const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");
const tagStatus = document.getElementById("tag-status");

let player1Pos = { x: 100, y: 100 };
let player2Pos = { x: 400, y: 100 };
let isPlayer1It = true;
let tagDelayActive = false;

const baseSpeed = 5;   // Base speed for both players
const slowSpeed = 1;   // Minimum speed for the runner
let currentSpeed = baseSpeed;  // Current speed of the runner
let speedDecayInterval;  // Interval to reduce runner speed
const speedDecayRate = 0.05;   // Speed decay rate per second
const speedDecayDelay = 2000;  // Delay before speed starts decaying (2 seconds)

let keys = {}; // Track key states

// Set initial positions
player1.style.left = player1Pos.x + "px";
player1.style.top = player1Pos.y + "px";
player2.style.left = player2Pos.x + "px";
player2.style.top = player2Pos.y + "px";

// Add event listeners for key press and release
document.addEventListener("keydown", (event) => {
  keys[event.key] = true;
});
document.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

// Start game loop
function gameLoop() {
  if (!tagDelayActive) {
    movePlayers();
  } else {
    moveNonItPlayer(); // Only the non-it player can move
  }
  checkTag();
  requestAnimationFrame(gameLoop);
}

// Move both players if tag delay is not active
function movePlayers() {
  if (!tagDelayActive) {
    movePlayer1();
    movePlayer2();
  }
}

// Move only the non-"it" player during tag delay
function moveNonItPlayer() {
  if (isPlayer1It) {
    movePlayer2(); // Player 2 moves if Player 1 is "it"
  } else {
    movePlayer1(); // Player 1 moves if Player 2 is "it"
  }
}

// Player 1 movement (Arrow Keys)
function movePlayer1() {
  let speed = isPlayer1It ? baseSpeed : currentSpeed; // Player 1 gets slower if not "it"
  if (keys["ArrowUp"] && player1Pos.y > 0) {
    player1Pos.y -= speed;
  }
  if (keys["ArrowDown"] && player1Pos.y < 520) { // Adjust for new barrier height
    player1Pos.y += speed;
  }
  if (keys["ArrowLeft"] && player1Pos.x > 0) {
    player1Pos.x -= speed;
  }
  if (keys["ArrowRight"] && player1Pos.x < 720) { // Adjust for new barrier width
    player1Pos.x += speed;
  }

  // Update Player 1 position
  player1.style.left = player1Pos.x + "px";
  player1.style.top = player1Pos.y + "px";
}

// Player 2 movement (WASD Keys)
function movePlayer2() {
  let speed = isPlayer1It ? currentSpeed : baseSpeed; // Player 2 gets slower if not "it"
  if (keys["w"] && player2Pos.y > 0) {
    player2Pos.y -= speed;
  }
  if (keys["s"] && player2Pos.y < 520) { // Adjust for new barrier height
    player2Pos.y += speed;
  }
  if (keys["a"] && player2Pos.x > 0) {
    player2Pos.x -= speed;
  }
  if (keys["d"] && player2Pos.x < 720) { // Adjust for new barrier width
    player2Pos.x += speed;
  }

  // Update Player 2 position
  player2.style.left = player2Pos.x + "px";
  player2.style.top = player2Pos.y + "px";
}

// Check if players are close enough to tag
function checkTag() {
  const dx = player1Pos.x - player2Pos.x;
  const dy = player1Pos.y - player2Pos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 80) { // Adjust for player size
    if (!tagDelayActive) {
      if (isPlayer1It) {
        tagStatus.textContent = "Player 2 is 'it'!";
        stopSpeedDecay();  // Stop speed decay when tagged
        resetRunnerSpeed(); // Reset speed after tagging
        isPlayer1It = false;
      } else {
        tagStatus.textContent = "Player 1 is 'it'!";
        stopSpeedDecay();  // Stop speed decay when tagged
        resetRunnerSpeed(); // Reset speed after tagging
        isPlayer1It = true;
      }
      activateTagDelay();
      startSpeedDecay();  // Start speed decay for new runner
    }
  }
}

// Implement tag delay
function activateTagDelay() {
  tagDelayActive = true;
  setTimeout(() => {
    tagDelayActive = false;
  }, 1000); // 1 second delay for the "it" player
}

// Start speed decay for the runner
function startSpeedDecay() {
  currentSpeed = baseSpeed;
  speedDecayInterval = setInterval(() => {
    if (currentSpeed > slowSpeed) {
      currentSpeed -= speedDecayRate;
    } else {
      currentSpeed = slowSpeed; // Minimum speed
    }
  }, 1000); // Reduce speed every second
}

// Stop speed decay
function stopSpeedDecay() {
  clearInterval(speedDecayInterval);
}

// Reset runner's speed to base after tag
function resetRunnerSpeed() {
  currentSpeed = baseSpeed;
}

// Start the game loop
gameLoop();
