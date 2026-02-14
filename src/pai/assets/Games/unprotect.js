const fs = require('fs');
const path = require('path');

const ASSETS_ROOT = path.join(__dirname, 'games');
const START_ROOT = path.join(
  ASSETS_ROOT
);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');

      const cleaned = content.replace(
        /<script>\s*if\s*\(\s*localStorage\.getItem\('SDSG'\)\s*!==\s*'active'\s*\)\s*\{\s*window\.location\.href\s*=\s*['"][^'"]+['"];\s*\}\s*<\/script>\s*/gs,
        ''
      );

      if (cleaned !== content) {
        fs.writeFileSync(fullPath, cleaned, 'utf8');
        console.log(`Removed injection: ${fullPath}`);
      }
    }
  }
}

walk(START_ROOT);
console.log('Done.');