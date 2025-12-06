const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400; canvas.height = 200;
let x = 0;
function loop() {
    ctx.fillStyle = 'black'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'lime'; ctx.fillRect(x, 80, 40, 40);
    x = (x + 2) % canvas.width;
    requestAnimationFrame(loop);
}
loop();