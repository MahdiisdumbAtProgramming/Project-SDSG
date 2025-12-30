// generateGames.js
const fs = require('fs');
const path = require('path');

const normal = './pai/assets/';
const premium = './pai/PREMIUM/assets/huh/stealer leave/there is nothing pay then you get/what are you doing/STOP/i cant understand/security left';

// Get all subdirectories in the normal folder
const directories = fs.readdirSync(normal, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

const games = [];
const premiumGames = [];

console.log('Scanning directories...\n');

// Scan normal games
directories.forEach(dir => {
    const runPath = path.join(normal, dir, 'run.html');
    if (fs.existsSync(runPath)) {
        games.push(dir);
        console.log(`✅ Found run.html in "${dir}"`);
    } else {
        console.log(`❌ No run.html in "${dir}"`);
    }
});

// Scan premium games
const premiumDirectories = fs.readdirSync(premium, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

premiumDirectories.forEach(dir => {
    const runPath = path.join(premium, dir, 'run.html');
    if (fs.existsSync(runPath)) {
        premiumGames.push(dir);
        console.log(`✅ Found run.html in PREMIUM "${dir}"`);
    } else {
        console.log(`❌ No run.html in PREMIUM "${dir}"`);
    }
});

// Get current directory
const currentDir = path.resolve(__dirname);

// Generate output
const output = `// Auto-generated list of games
const games = ${JSON.stringify(games, null, 4)};
const premiumGames = ${JSON.stringify(premiumGames, null, 4)};`;

// Write to file
fs.writeFileSync(path.join(currentDir, 'games.js'), output, 'utf8');

console.log(`\nDone! games.js updated with ${games.length} normal games and ${premiumGames.length} premium games.`);