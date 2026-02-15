const folder = './archive/'; // relative to your page
const parts = Array.from({ length: 20 }, (_, i) => `Project SDSG.part.zip.${String(i + 1).padStart(3, '0')}`);

document.getElementById('install').onclick = async () => {
    const status = document.getElementById('status');
    status.textContent = 'Downloading parts...';

    try {
        const blobs = [];
        for (let i = 0; i < parts.length; i++) {
            const response = await fetch(folder + parts[i]);
            if (!response.ok) throw new Error(`Failed to fetch ${parts[i]}`);
            const arrayBuffer = await response.arrayBuffer();
            blobs.push(new Uint8Array(arrayBuffer));
            status.textContent = `Downloaded ${parts[i]} (${i + 1}/${parts.length})`;
        }

        // Merge all parts into one zip
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