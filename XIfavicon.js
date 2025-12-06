const fs = require("fs");
const path = require("path");

// Exact match regex for the favicon link
const FAVICON_REGEX = /<link rel="icon" type="image\/x-icon" href="\/favicon\.ico">/g;

function processHTML(filePath) {
    let content = fs.readFileSync(filePath, "utf8");

    if (!FAVICON_REGEX.test(content)) {
        console.log(`No favicon to remove: ${filePath}`);
        return;
    }

    // Remove all exact matches
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
