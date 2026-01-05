const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const currentDir = path.resolve(__dirname);
const zipName = 'Project SDSG.zip';
const outputPath = path.join(currentDir, zipName);

// List of files/folders to skip
const skipList = new Set([
   'node_modules',
  '.git',
  'package.json',
  'package-lock.json',
  '.vs',
  '.gitattributes',
  '.gitignore',
  'README.md',
  'REL.js',
  zipName // so it doesn't include the zip itself
]);

const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`${zipName} created: ${archive.pointer()} total bytes`);
});

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') console.warn(err);
  else throw err;
});

archive.on('error', (err) => { throw err; });

// Log each file added
archive.on('entry', (entry) => {
  console.log('Archiving:', entry.name);
});

archive.pipe(output);

// Recursive function to add files/folders manually
function addFolder(folder, baseInZip = '') {
  const items = fs.readdirSync(folder);
  for (const item of items) {
    if (skipList.has(item)) continue;

    const fullPath = path.join(folder, item);
    const relativePath = path.join(baseInZip, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      addFolder(fullPath, relativePath); // Recurse into folder
    } else if (stats.isFile()) {
      archive.file(fullPath, { name: relativePath });
    }
  }
}

// Start zipping
addFolder(currentDir);

archive.finalize();
