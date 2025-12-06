// generateGames.js
const fs = require('fs');
const path = require('path');

const currentDir = __dirname;

// Get all subdirectories in the current folder
const directories = fs.readdirSync(currentDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

const games = [];

console.log('Scanning directories...\n');

directories.forEach(dir => {
    const runPath = path.join(currentDir, dir, 'run.html');
    if (fs.existsSync(runPath)) {
        games.push(dir);
        console.log(`✅ Found run.html in "${dir}"`);
    } else {
        console.log(`❌ No run.html in "${dir}"`);
    }
});

const output = `// Auto-generated list of games\nconst games = ${JSON.stringify(games, null, 4)};`;

fs.writeFileSync(path.join(currentDir, 'games.js'), output, 'utf8');

console.log(`\nDone! games.js updated with ${games.length} entries.`);
