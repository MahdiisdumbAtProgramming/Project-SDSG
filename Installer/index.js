<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Install Project SDSG</title>
<style>
:root{--bg:#0d1117;--panel:#161b22;--accent:#58a6ff;--accent-2:#f78166;--muted:#c9d1d9;--soft:#79c0ff}
html,body{height:100%}
body,html{margin:0;padding:0;font-family:'Courier New',Courier,monospace;background-color:var(--bg);color:var(--muted);display:flex;justify-content:center;align-items:center;height:100vh;overflow:hidden;user-select:none}
button{background-color:var(--panel);color:var(--accent);border:2px dashed var(--accent);padding:12px 24px;font-size:16px;cursor:pointer;transition:transform 220ms cubic-bezier(.2,.9,.2,1),box-shadow 220ms ease,color 220ms ease;font-weight:700;letter-spacing:1px;border-radius:6px;text-transform:uppercase;box-shadow:0 0 8px rgb(88 166 255 / .12);outline:none}
button:hover{transform:scale(1.06);background-color:var(--accent);color:var(--bg);box-shadow:0 0 18px rgb(88 166 255 / .25)}
.container{max-width:900px;width:100%;padding:30px;text-align:center;background-color:var(--panel);border-radius:12px;position:relative;z-index:1}
</style>
</head>
<body>
<div class="container">
<h1>Project SDSG Installer</h1>
<button id="install">Install</button>
<p id="status"></p>
</div>

<script>
const folder = './archive/'; // folder with your .zip parts

async function fetchPartsList() {
    // This assumes your server returns a directory listing in HTML
    const response = await fetch(folder);
    if (!response.ok) throw new Error('Failed to fetch folder');
    const html = await response.text();

    // Extract filenames ending with .zip.001, .zip.002, etc.
    const regex = /Project SDSG\.part\.zip\.\d+/g;
    const matches = html.match(regex);
    if (!matches) throw new Error('No parts found in folder');
    
    // Remove duplicates & sort numerically
    const unique = [...new Set(matches)];
    unique.sort((a, b) => {
        const n1 = parseInt(a.split('.').pop(), 10);
        const n2 = parseInt(b.split('.').pop(), 10);
        return n1 - n2;
    });
    return unique;
}

document.getElementById('install').onclick = async () => {
    const status = document.getElementById('status');
    status.textContent = 'Scanning folder for parts...';

    try {
        const parts = await fetchPartsList();
        const blobs = [];

        for (let i = 0; i < parts.length; i++) {
            const response = await fetch(folder + parts[i]);
            if (!response.ok) throw new Error(`Failed to fetch ${parts[i]}`);
            const arrayBuffer = await response.arrayBuffer();
            blobs.push(new Uint8Array(arrayBuffer));
            status.textContent = `Downloaded ${parts[i]} (${i+1}/${parts.length})`;
        }

        const totalLength = blobs.reduce((sum, arr) => sum + arr.length, 0);
        const merged = new Uint8Array(totalLength);
        let offset = 0;
        for (const arr of blobs) {
            merged.set(arr, offset);
            offset += arr.length;
        }

        const blob = new Blob([merged], { type: 'application/zip' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Project SDSG.zip';
        link.click();

        status.textContent = 'Download complete!';
    } catch (err) {
        status.textContent = 'Error: ' + err.message;
        console.error(err);
    }
};
</script>
</body>
</html>