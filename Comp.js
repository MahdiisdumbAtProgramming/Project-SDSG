const fs = require('fs');
const path = require('path');

const ROOT_DIR = './'; // Change this to your target folder
const IGNORE_DIRS = ['.git', 'node_modules'];

/**
 * Recursively traverse directories and rename files/folders
 */
function renameRecursive(dir) {
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    if (IGNORE_DIRS.includes(item)) return; // Skip ignored dirs

    const oldPath = path.join(dir, item);
    const stats = fs.statSync(oldPath);

    let newName = item.replace(/ /g, '-');
    const newPath = path.join(dir, newName);

    // Rename if different
    if (oldPath !== newPath) {
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed: ${oldPath} -> ${newPath}`);
    }

    if (stats.isDirectory()) {
      renameRecursive(newPath); // Recurse into renamed folder
    }
  });
}

/**
 * Recursively replace references in all files
 */
function replaceReferences(dir) {
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    if (IGNORE_DIRS.includes(item)) return; // Skip ignored dirs

    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      replaceReferences(fullPath);
    } else if (stats.isFile()) {
      let content = fs.readFileSync(fullPath, 'utf8');

      // Replace all spaces in filenames and folder names with dashes
      const filesAndDirs = getAllNames(ROOT_DIR);
      filesAndDirs.forEach(name => {
        const dashName = name.replace(/ /g, '-');
        if (name !== dashName) {
          const regex = new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
          content = content.replace(regex, dashName);
        }
      });

      fs.writeFileSync(fullPath, content);
    }
  });
}

/**
 * Get all file and folder names recursively
 */
function getAllNames(dir) {
  let names = [];
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    if (IGNORE_DIRS.includes(item)) return;

    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);
    const relativePath = path.relative(ROOT_DIR, fullPath);

    names.push(relativePath);

    if (stats.isDirectory()) {
      names = names.concat(getAllNames(fullPath));
    }
  });

  return names;
}

// First rename all files/folders
renameRecursive(ROOT_DIR);

// Then replace references inside all files
replaceReferences(ROOT_DIR);

console.log('Done!');