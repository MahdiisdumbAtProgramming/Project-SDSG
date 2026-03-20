const fs = require('fs');
const path = require('path');

const ROOT_DIR = './'; // Target folder
const IGNORE_DIRS = ['.git', 'node_modules'];

/**
 * Recursively traverse directories and delete files/folders with spaces
 */
function deleteSpacedFiles(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
        if (IGNORE_DIRS.includes(item)) continue; // Skip ignored dirs

        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);

        if (item.includes(' ')) {
            if (stats.isDirectory()) {
                fs.rmSync(fullPath, { recursive: true, force: true });
                console.log(`Deleted folder: ${fullPath}`);
            } else {
                fs.unlinkSync(fullPath);
                console.log(`Deleted file: ${fullPath}`);
            }
        } else if (stats.isDirectory()) {
            // Recurse into subdirectory
            deleteSpacedFiles(fullPath);
        }
    }
}

deleteSpacedFiles(ROOT_DIR);
console.log('Done deleting all files and folders with spaces!');