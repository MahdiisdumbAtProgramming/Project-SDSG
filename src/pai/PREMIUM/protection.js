const fs = require('fs');
const path = require('path');

const ASSETS_ROOT = path.join(__dirname, 'assets');
const START_ROOT = path.join(
  ASSETS_ROOT,
  'huh',
  'stealer leave',
  'there is nothing pay then you get',
  'what are you doing',
  'STOP',
  'i cant understand',
  'security left'
);

const TARGET_404 = path.join(ASSETS_ROOT, 'Fake', '404.html');

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

      // already injected → skip
      if (content.includes("localStorage.getItem('SDSG')")) {
        console.log(`Skipped: ${fullPath}`);
        continue;
      }

      const fromDir = path.dirname(fullPath);

      let redirectPath = path
        .relative(fromDir, TARGET_404)
        .replace(/\\/g, '/');

      const inject = `<script>
if (localStorage.getItem('SDSG') !== 'active') {
  window.location.href = '${redirectPath}';
}
</script>
`;

      content = content.replace(/^\uFEFF/, '');
      fs.writeFileSync(fullPath, inject + '\n' + content, 'utf8');

      console.log(`Injected: ${fullPath}`);
      console.log(` → ${redirectPath}`);
    }
  }
}

walk(START_ROOT);
console.log('Done.');