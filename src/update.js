const fs = require('fs');
const path = require('path');

// Paths
const NORMAL_PATH = './pai/assets/';
const LEGACY_PATH = './pai/assets/legacy'; // new legacy folder
const PREMIUM_PATH ='./pai/assets/PREMIUM/assets/huh/stealer leave/there is nothing pay then you get/what are you doing/STOP/i cant understand/security left';

const normalDirs = fs.readdirSync(NORMAL_PATH, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

const legacyDirs = fs.existsSync(LEGACY_PATH) 
    ? fs.readdirSync(LEGACY_PATH, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
    : [];

const premiumDirs = fs.readdirSync(PREMIUM_PATH, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

const games = [];
const legacyGames = [];
const premiumGames = [];

console.log('Scanning directories...\n');

// Normal games
normalDirs.forEach(dir => {
    const runPath = path.join(NORMAL_PATH, dir, 'run.html');
    if (fs.existsSync(runPath)) {
        games.push(dir);
        console.log(`✅ Found run.html in NORMAL "${dir}"`);
    } else {
        console.log(`❌ No run.html in NORMAL "${dir}"`);
    }
});

// Legacy games
legacyDirs.forEach(dir => {
    const runPath = path.join(LEGACY_PATH, dir, 'run.html');
    if (fs.existsSync(runPath)) {
        legacyGames.push(dir);
        console.log(`🦖 Found run.html in LEGACY "${dir}"`);
    } else {
        console.log(`❌ No run.html in LEGACY "${dir}"`);
    }
});

// Premium games
premiumDirs.forEach(dir => {
    const runPath = path.join(PREMIUM_PATH, dir, 'run.html');
    if (fs.existsSync(runPath)) {
        premiumGames.push(dir);
        console.log(`💎 Found run.html in PREMIUM "${dir}"`);
    } else {
        console.log(`❌ No run.html in PREMIUM "${dir}"`);
    }
});

const currentDir = path.resolve(__dirname);
const output = `// Auto-generated list of games
const games = ${JSON.stringify(games, null, 4)};
const legacyGames = ${JSON.stringify(legacyGames, null, 4)};
const premiumGames = ${JSON.stringify(premiumGames, null, 4)};
const gameschk = ${JSON.stringify(games, null, 4)};
const legacyGameschk = ${JSON.stringify(legacyGames, null, 4)};
const premiumGameschk = ${JSON.stringify(premiumGames, null, 4)};
`;

fs.writeFileSync(path.join(currentDir, 'games.js'), output, 'utf8');
console.log(`\nDone! games.js updated with ${games.length} normal games, ${legacyGames.length} legacy games, and ${premiumGames.length} premium games.`);