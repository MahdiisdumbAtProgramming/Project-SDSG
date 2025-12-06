const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const currentDir = path.resolve(__dirname);
const zipName = 'Project SDSG.zip';
const outputPath = path.join(currentDir, zipName);

const skipList = new Set([
  'node_modules',
  '.git',
  '.vs',
  'package.json',
  'package-lock.json',
  zipName
]);

const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', { zlib: { level: 9 } }); // max DEFLATE compression

output.on('close', () => {
  console.log(`${zipName} created: ${archive.pointer()} total bytes`);
});

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') console.warn(err);
  else throw err;
});

archive.on('error', (err) => { throw err; });

archive.on('entry', (entry) => {
  console.log('Archiving:', entry.name);
});

archive.pipe(output);

// Recursively add files/folders
function addFolder(folder, baseInZip = '') {
  const items = fs.readdirSync(folder);
  for (const item of items) {
    if (skipList.has(item)) continue;

    const fullPath = path.join(folder, item);
    const relativePath = path.join(baseInZip, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      const folderFiles = fs.readdirSync(fullPath);
      if (folderFiles.length === 0) {
        // Preserve empty directories
        archive.append('', { name: relativePath + '/' });
      }
      addFolder(fullPath, relativePath); // recurse
    } else if (stats.isFile()) {
      archive.file(fullPath, { name: relativePath });
    }
  }
}

addFolder(currentDir);

archive.finalize();
