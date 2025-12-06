const fs = require("fs");
const path = require("path");

// Matches ANY <link ... rel="icon" ...> or rel='shortcut icon' etc.
// Case-insensitive, eats variations, because HTML in the wild is a crime scene
const FAVICON_REGEX = /<link[^>]*rel=["']?(icon|shortcut icon)["']?[^>]*>/gi;

function processHTML(filePath) {
    let content = fs.readFileSync(filePath, "utf8");

    if (!FAVICON_REGEX.test(content)) {
        console.log(`No favicon to remove: ${filePath}`);
        return;
    }

    // Remove all favicon link tags
    const updated = content.replace(FAVICON_REGEX, "");

    fs.writeFileSync(filePath, updated, "utf8");
    console.log(`Removed favicon(s): ${filePath}`);
}

function scanDir(directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            scanDir(fullPath);
        } else if (file.toLowerCase().endsWith(".html")) {
            processHTML(fullPath);
        }
    }
}

// Start from current directory
scanDir(process.cwd());

console.log("Extermination complete.");
