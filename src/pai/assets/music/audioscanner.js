const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const musicDir = path.join(__dirname, 'mus');
const outputFile = path.join(__dirname, 'musiclist.js');

// Recursively get all files
function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            getAllFiles(fullPath, fileList);
        } else {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

// Hash file contents
function hashFile(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('md5');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
}

// Ask question using readline
function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
}

// Smart shorten filenames
function smartShorten(name) {
    const ext = path.extname(name);
    let base = path.basename(name, ext);

    // Remove common words like OST, soundtrack, etc.
    base = base.replace(/\bOST\b|\bSoundtrack\b/gi, '');

    // Replace hyphens and spaces with underscore
    base = base.replace(/[-\s]+/g, '_');

    // Remove multiple underscores
    base = base.replace(/_+/g, '_');

    // Trim underscores from start/end
    base = base.replace(/^_+|_+$/g, '');

    // Capitalize words
    base = base.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('_');

    return base + ext;
}

(async () => {
    let allFiles = getAllFiles(musicDir);

    console.log("Scanned files:");
    allFiles.forEach(f => console.log(" - " + path.relative(musicDir, f)));

    const hashMap = {};
    const duplicates = {};

    // Detect duplicates
    allFiles.forEach(file => {
        const hash = hashFile(file);
        if (hashMap[hash]) {
            if (!duplicates[hash]) duplicates[hash] = [hashMap[hash]];
            duplicates[hash].push(file);
        } else {
            hashMap[hash] = file;
        }
    });

    // Handle duplicates
    for (const hash in duplicates) {
        const files = duplicates[hash];
        console.log("\nDuplicate files detected:");
        files.forEach((f, i) => console.log(`${i + 1}: ${path.relative(musicDir, f)}`));
        const answer = await askQuestion("Enter the number of the file to KEEP: ");
        const keep = parseInt(answer);
        files.forEach((f, i) => {
            if (i + 1 !== keep) {
                try {
                    fs.unlinkSync(f);
                    console.log(`Deleted ${path.relative(musicDir, f)}`);
                } catch (err) {
                    console.warn(`Could not delete ${path.relative(musicDir, f)}: ${err.message}`);
                }
            }
        });
    }

    // Rename files to smart shortened names
    allFiles = getAllFiles(musicDir);
    const renamedFiles = [];
    for (const f of allFiles) {
        const relPath = path.relative(musicDir, f);
        const newName = smartShorten(relPath);
        const newPath = path.join(musicDir, newName);

        if (f !== newPath) {
            try {
                fs.renameSync(f, newPath);
                console.log(`Renamed: ${relPath} → ${newName}`);
            } catch (err) {
                console.warn(`Failed to rename ${relPath}: ${err.message}`);
            }
        }
        renamedFiles.push(newName.replace(/\\/g, '/'));
    }

    // Generate browser-friendly musiclist.js
    const fileContent = `// This file is auto-generated\nconst audioFiles = ${JSON.stringify(renamedFiles, null, 4)};\n`;
    fs.writeFileSync(outputFile, fileContent, 'utf-8');

    console.log(`\nBrowser-ready musiclist.js created with ${renamedFiles.length} files.`);
})();
