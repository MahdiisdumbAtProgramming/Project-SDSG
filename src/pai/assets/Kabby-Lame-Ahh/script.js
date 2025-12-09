 const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  let angle = 0;

  function drawKhabyGesture() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw central box
    const boxWidth = 60;
    const boxHeight = 60;
    const boxX = canvas.width / 2 - boxWidth / 2;
    const boxY = canvas.height / 2 - boxHeight / 2;
    ctx.fillStyle = '#4b2e2b';
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    // Hand motion parameters
    const orbitY = Math.sin(angle) * 30; // vertical motion
    const baseY = boxY + boxHeight / 2;
    const baseRadius = 15;
    const scale = 1 + Math.cos(angle) * 0.5; // size changes with depth

    // Left hand
    const leftX = boxX - 80;
    const leftY = baseY + orbitY;
    const leftRadius = baseRadius * scale;

    ctx.beginPath();
    ctx.arc(leftX, leftY, leftRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'brown';
    ctx.fill();

    // Right hand
    const rightX = boxX + boxWidth + 80;
    const rightY = baseY + orbitY;
    const rightRadius = baseRadius * scale;

    ctx.beginPath();
    ctx.arc(rightX, rightY, rightRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'brown';
    ctx.fill();

    angle += 0.05;
    requestAnimationFrame(drawKhabyGesture);
  }

  drawKhabyGesture();