const fs = require('fs');
const path = require('path');

// Folder to scan
const picsDir = path.join(__dirname, 'pics');

// Output file
const outputFile = path.join(__dirname, 'pics.js');

// Supported image extensions
const imgExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];

fs.readdir(picsDir, (err, files) => {
    if (err) {
        console.error('Error reading /pics:', err);
        return;
    }

    // Filter only image files
    const images = files.filter(f => imgExtensions.includes(path.extname(f).toLowerCase()));

    // Build JS content
    const jsContent = `// Auto-generated list of images from /pics
const images = ${JSON.stringify(images, null, 4)};
module.exports = { images };
`;

    // Write to pics.js
    fs.writeFile(outputFile, jsContent, err => {
        if (err) console.error('Error writing pics.js:', err);
        else console.log('pics.js generated with', images.length, 'images.');
    });
});
