const fs = require('fs');
const path = require('path');

const ROOT_DIR = './';
const IGNORE_DIRS = ['.git', 'node_modules'];

// Recursively get all files
function getAllFiles(dir) {
    let results = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        if (IGNORE_DIRS.includes(item)) continue;

        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            results = results.concat(getAllFiles(fullPath));
        } else if (stats.isFile()) {
            results.push(fullPath);
        }
    }

    return results;
}

// Replace spaces with dashes in filenames inside quoted paths
function fixFileReferences() {
    const allFiles = getAllFiles(ROOT_DIR);

    const codeFiles = allFiles.filter(f => /\.(html|js|css|json)$/.test(f));

    codeFiles.forEach(filePath => {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Match quoted paths (single or double quotes) that contain a dot in the last segment
        const regex = /(['"])([^'"]+\.[a-zA-Z0-9]+)\1/g;

        content = content.replace(regex, (match, quote, p1) => {
            // Split path into segments to only replace spaces in the filename (last segment)
            const segments = p1.split('/');
            const last = segments[segments.length - 1];

            if (last.includes(' ')) {
                segments[segments.length - 1] = last.replace(/ /g, '-');
                const newPath = segments.join('/');
                modified = true;
                console.log(`Fixed reference in ${filePath}: "${p1}" -> "${newPath}"`);
                return quote + newPath + quote;
            }
            return match;
        });

        if (modified) fs.writeFileSync(filePath, content, 'utf8');
    });
}

fixFileReferences();
console.log('Done fixing file references with spaces!');