const canvas = document.getElementById('editorCanvas');
const ctx = canvas.getContext('2d');

// Load levels from level.js
let allLevels = JSON.parse(JSON.stringify(levels));
let currentLevelIndex = 0;
let currentLevel = allLevels[currentLevelIndex];

// Toolbar
let currentTool = 'platform';
document.getElementById('toolPlatform').onclick = () => setTool('platform');
document.getElementById('toolSpike').onclick = () => setTool('spike');
document.getElementById('toolDelete').onclick = () => setTool('delete');

function setTool(tool) {
    currentTool = tool;
    document.querySelectorAll('.toolbar button').forEach(b => b.classList.remove('active'));
    document.getElementById('tool' + tool.charAt(0).toUpperCase() + tool.slice(1)).classList.add('active');
}

// Dragging
let selected = null, offsetX = 0, offsetY = 0;

// Level switching
document.getElementById('prevLevel').onclick = () => {
    if (currentLevelIndex > 0) currentLevelIndex--;
    currentLevel = allLevels[currentLevelIndex];
    document.getElementById('levelLabel').innerText = `Level ${currentLevelIndex + 1}`;
    draw();
};
document.getElementById('nextLevel').onclick = () => {
    if (currentLevelIndex < allLevels.length - 1) currentLevelIndex++;
    currentLevel = allLevels[currentLevelIndex];
    document.getElementById('levelLabel').innerText = `Level ${currentLevelIndex + 1}`;
    draw();
};
document.getElementById('addLevel').onclick = () => {
    allLevels.push([{ x: 0, y: 590, width: 800, height: 10 }]); // default floor
    currentLevelIndex = allLevels.length - 1;
    currentLevel = allLevels[currentLevelIndex];
    document.getElementById('levelLabel').innerText = `Level ${currentLevelIndex + 1}`;
    draw();
};

// Canvas interactions
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    currentLevel.filter(p => !p.type).forEach(p => ctx.fillRect(p.x, p.y, p.width, p.height));

    ctx.fillStyle = 'red';
    currentLevel.filter(p => p.type === 'spike').forEach(p => ctx.fillRect(p.x, p.y, p.width, p.height));
}

canvas.addEventListener('mousedown', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    selected = currentLevel.find(o => mx >= o.x && mx <= o.x + o.width && my >= o.y && my <= o.y + o.height);
    if (selected && currentTool !== 'delete') {
        offsetX = mx - selected.x;
        offsetY = my - selected.y;
        return;
    }

    switch (currentTool) {
        case 'platform':
            currentLevel.push({ x: mx, y: my, width: 60, height: 10 });
            break;
        case 'spike':
            currentLevel.push({ type: 'spike', x: mx, y: my, width: 20, height: 20 });
            break;
        case 'delete':
            currentLevel = currentLevel.filter(p => !(mx >= p.x && mx <= p.x + p.width && my >= p.y && my <= p.y + p.height));
            break;
    }

    draw();
});

canvas.addEventListener('mousemove', e => {
    if (!selected) return;
    const rect = canvas.getBoundingClientRect();
    selected.x = e.clientX - rect.left - offsetX;
    selected.y = e.clientY - rect.top - offsetY;
    draw();
});

canvas.addEventListener('mouseup', () => selected = null);

// Download button
// Replace the download button click with this:
document.getElementById('downloadLevel').onclick = () => {
    console.log("Copy this output and save it as level.js:");
    console.log(`const levels = ${JSON.stringify(allLevels, null, 2)};`);
    alert("Level data printed to console! Open DevTools to copy.");
};

draw();