const audioFiles = [
    "Ivestigations.mp3",
    "WAN1.mp3",
    "Lingangulli Chill.mp3",
    "Lingangulli N64.mp3",
    "Wet Hands.mp3",
    "Fishy On Me.mp3",
    "Elevator Music.mp3",
    "cc3d.mp3",
    "gman.mp3",
    "sinner.mp3",
    "Mr mcbeth.mp3",
    "hl.mp3",
    "echol.mp3",
    "echoa.mp3",
    "echoc.mp3",
    "eggman sonicexe.mp3",
    "sampton.ogg",
    "spiderdance.mp3",
    "Undyne beta.mp3",
    "vauge.mp3",
    "metal crusher.ogg",
    "CP.mp3",
    "AH.mp3",
    "EFFOC.mp3",
    "forskin.mp3",
    "CRINGE.mp3",
    "1fs.ogg",
    "2fs.ogg",
    "3fs.ogg",
    "4fs.ogg",
    "5fs.ogg",
    "6fs.ogg",
    "floop1.ogg",
    "floop2.ogg",
    "flowey1.ogg",
    "flowey2.ogg",
    "floweywarn.ogg",
    "OH.wav",
    "TED.wav",
    "snicker.wav",
    "static.wav",
    "pf.ogg",
    "finale.ogg",
    "spawn.wav",
    "atkwrn.wav",
    "floweyarm.wav",
    "λ finale.mp3",
    "1c.mp3",
    "2c.mp3",
    "3c.mp3",
    "4c.mp3",
    "5c.mp3",
    "6c.ogg",
    "7c.ogg",
    "8c.ogg",
    "9c.ogg",
    "10c.mp3",
    "dan.mp3",
    "heal.wav",
    "heartbeat.wav",
    "hurt.wav",
    "k.mp3",
    "l.mp3",
    "mv.wav",
    "sel.wav",
    "OL.ogg",
    "oheal.wav",
    "s.wav",
    "peace.mp3",
    "slash.wav",
    "nuetural.ogg",
    "toomuch.mp3",
    "sad boss.mp3",
    "w.ogg",
    "intro.mp3",
    "knight.ogg",
    'Glitchsong.wav',
    'Wither Storm.mp3',
    '1cnew.mp3',
    '2cnew.mp3',
    '3cnew.mp3',
    '4cnew.mp3',
    '5cnew.mp3',
    '6cnew.ogg',
    '7cnew.mp3',
    '8cnew.ogg',
    '9cnew.ogg',
    '10cnew.mp3'
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