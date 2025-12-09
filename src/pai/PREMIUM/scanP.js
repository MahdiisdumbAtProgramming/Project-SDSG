// generatePremiumGames.js
const fs = require('fs');
const path = require('path');

const premiumDir = path.join(__dirname, 'assets', 'huh', 'stealer leave', 'there is nothing pay then you get', 'what are you doing', 'STOP', 'i cant understand', 'security left');

// Helper to sanitize folder names (remove spaces, parentheses, special chars)
function sanitizeName(name) {
    return name.replace(/[\s\(\)\[\]!@#$%^&*]/g, '');
}

// Check if directory exists
if (!fs.existsSync(premiumDir)) {
    console.error('Directory not found:', premiumDir);
    process.exit(1);
}

const directories = fs.readdirSync(premiumDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

const games = [];

console.log('Scanning premium directories...\n');

directories.forEach(dir => {
    const runPath = path.join(premiumDir, dir, 'run.html');
    if (fs.existsSync(runPath)) {
        const sanitized = sanitizeName(dir);
        if (sanitized !== dir) {
            const oldPath = path.join(premiumDir, dir);
            const newPath = path.join(premiumDir, sanitized);
            fs.renameSync(oldPath, newPath);
            console.log(`✏️ Renamed "${dir}" → "${sanitized}"`);
        }
        games.push(sanitized);
        console.log(`✅ Found run.html in "${sanitized}"`);
    } else {
        console.log(`❌ No run.html in "${dir}"`);
    }
});

// Generate games.js
const output = `// Auto-generated premium games list\nconst premiumGames = ${JSON.stringify(games, null, 4)};`;

fs.writeFileSync(path.join(__dirname, 'premiumGames.js'), output, 'utf8');

console.log(`\nDone! premiumGames.js updated with ${games.length} entries.`);
