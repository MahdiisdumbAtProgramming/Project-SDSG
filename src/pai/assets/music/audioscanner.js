const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const picDir = path.join(__dirname, 'pics');
const outputFile = path.join(__dirname, 'piclist.js');

const IMAGE_EXTS = new Set([
    '.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg'
]);

function getAllFiles(dir, fileList = []) {
    for (const file of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            getAllFiles(fullPath, fileList);
        } else if (IMAGE_EXTS.has(path.extname(file).toLowerCase())) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

function hashFile(filePath) {
    return crypto
        .createHash('md5')
        .update(fs.readFileSync(filePath))
        .digest('hex');
}

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve =>
        rl.question(query, ans => {
            rl.close();
            resolve(ans);
        })
    );
}

function smartShorten(name) {
    const ext = path.extname(name);
    let base = path.basename(name, ext);

    base = base
        .replace(/\([^)]*\)/g, '')     // remove (stuff)
        .replace(/\[[^\]]*\]/g, '')    // remove [stuff]
        .replace(/\b(image|img|photo|picture|wallpaper)\b/gi, '')
        .replace(/[-\s]+/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '');

    base = base
        .split('_')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('_');

    return base + ext.toLowerCase();
}

(async () => {
    let allFiles = getAllFiles(picDir);

    console.log('Scanned images:');
    allFiles.forEach(f => console.log(' - ' + path.relative(picDir, f)));

    const hashMap = {};
    const duplicates = {};

    for (const file of allFiles) {
        const hash = hashFile(file);
        if (hashMap[hash]) {
            (duplicates[hash] ??= [hashMap[hash]]).push(file);
        } else {
            hashMap[hash] = file;
        }
    }

    for (const hash in duplicates) {
        const files = duplicates[hash];
        console.log('\nDuplicate images detected:');
        files.forEach((f, i) =>
            console.log(`${i + 1}: ${path.relative(picDir, f)}`)
        );

        const keep = parseInt(await askQuestion('Enter number to KEEP: '), 10);

        files.forEach((f, i) => {
            if (i + 1 !== keep) {
                fs.unlinkSync(f);
                console.log('Deleted ' + path.relative(picDir, f));
            }
        });
    }

    allFiles = getAllFiles(picDir);
    const renamedFiles = [];

    for (const f of allFiles) {
        const newName = smartShorten(f);
        const newPath = path.join(path.dirname(f), newName);

        if (f !== newPath) {
            fs.renameSync(f, newPath);
            console.log(
                'Renamed:',
                path.basename(f),
                '→',
                path.basename(newPath)
            );
        }

        renamedFiles.push(
            path.relative(picDir, newPath).replace(/\\/g, '/')
        );
    }

    fs.writeFileSync(
        outputFile,
        `// Auto-generated\nconst imageFiles = ${JSON.stringify(renamedFiles, null, 4)};\n`,
        'utf8'
    );

    console.log(`\nBrowser-ready piclist.js created (${renamedFiles.length} images).`);
})();
