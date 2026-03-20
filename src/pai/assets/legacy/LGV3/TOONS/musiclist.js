const audioFiles = [
    'Chase-music.mp3',
    'Flufing-A-Duck.mp3',
    'Funky-Town.mp3',
    'Ivestigations.mp3',
    'We-Are-Number-1.mp3'
];

// Sort audio files alphabetically
audioFiles.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

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