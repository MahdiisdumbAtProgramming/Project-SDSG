function parseLeadingNumber(name) {
    const m = name.trim().match(/^(\d+)/);
    return m ? parseInt(m[1], 10) : null;
}

audioFiles.sort((a, b) => {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();

    const aNum = parseLeadingNumber(aLower);
    const bNum = parseLeadingNumber(bLower);

    if (aNum !== null && bNum !== null) {
        // Both have leading numbers: compare numerically first
        if (aNum !== bNum) return aNum - bNum;
        // If numbers equal, compare the remainder of the filename
        const aRest = aLower.replace(/^\d+/, '').trim();
        const bRest = bLower.replace(/^\d+/, '').trim();
        return aRest.localeCompare(bRest);
    }

    if (aNum !== null && bNum === null) {
        // Numbered filenames come before non-numbered
        return -1;
    }

    if (aNum === null && bNum !== null) {
        return 1;
    }

    // Neither has leading number: regular case-insensitive locale compare
    return aLower.localeCompare(bLower);
});

const container = document.getElementById('audio-container');
let currentAudio = null;
let activeButton = null;

audioFiles.forEach(file => {
    const button = document.createElement('button');
    button.textContent = file;
    button.classList.add('audio-button');

    // Load audio from /mus/ folder
    const audio = new Audio(`./mus/${file}`);
    audio.loop = true;

    button.addEventListener('click', () => {
        // Stop any currently playing audio
        if (currentAudio && currentAudio !== audio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        // Play the clicked audio from start
        audio.currentTime = 0;
        audio.play();
        currentAudio = audio;

        // Highlight the active button
        if (activeButton) activeButton.classList.remove('active');
        button.classList.add('active');
        activeButton = button;
    });

    container.appendChild(button);
});