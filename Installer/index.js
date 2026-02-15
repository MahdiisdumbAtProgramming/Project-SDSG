
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