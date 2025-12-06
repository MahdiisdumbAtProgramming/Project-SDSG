document.getElementById('messageButton').addEventListener('click', function () {
    // Calm intro
    const calmAudio = document.querySelector('audio');
    document.getElementById('messageDisplay').innerText = "Processing your reward...";

    setTimeout(() => {
        document.getElementById('messageDisplay').innerText = "Verifying identity...";
    }, 2000);

    setTimeout(() => {
        // Stop calm music
        calmAudio.pause();
        calmAudio.currentTime = 0;

        // Switch to scary mode
        document.body.classList.add('scary');
        document.getElementById('messageDisplay').classList.add('flicker');
        document.getElementById('messageDisplay').innerText =
            "PWNED!\nHACKED!\nYOU ARE AT THE MERCY OF THE ENTITY\n\n" +
            "!!! SYSTEM LOCKED !!!\n" +
            "Your memories are now encrypted.\n" +
            "Deliver 5345345345345345 bitcoin to GETunpwnen@mercy.com to restore access.\n" +
            "Time Remaining: ∞";

        // Play jumpscare
        let audio = new Audio('jumpscare.mp3');
        audio.play();

        // Play ambient horror music
        let ambientAudio = new Audio('musicalt.mp3');
        ambientAudio.loop = true;
        ambientAudio.volume = 0.5;
        ambientAudio.play();

        // Flash random images forever
        let images = ['1.png', '2.png', '3.png'];
        let imgElement = document.createElement('img');
        imgElement.classList.add('fullscreen-img');
        document.body.appendChild(imgElement);

        // Flashing scary text
        let flashText = document.createElement('div');
        flashText.style.position = 'fixed';
        flashText.style.top = '50%';
        flashText.style.left = '50%';
        flashText.style.transform = 'translate(-50%, -50%)';
        flashText.style.fontSize = '48px';
        flashText.style.color = 'red';
        flashText.style.zIndex = '1001';
        flashText.style.fontFamily = 'monospace';
        flashText.style.textShadow = '0 0 10px red';
        document.body.appendChild(flashText);

        let scaryWords = [
            'PWNED', 'HACKED', 'SYSTEM BREACHED', 'NO ESCAPE',
            'YOU ARE MINE', 'ERROR 666', 'CORRUPTED', 'MERCY DENIED',
            'MERCY LOCKED', 'TRANSMISSION LOST', 'ENTITY DETECTED', 'SANITY LOST', 'HDD FAILURE', 'DATA LEAK', 'INTRUDER ALERT', 'SYSTEM FAILURE', 'FATAL ERROR', 'ACCESS DENIED', 'VIRUS DETECTED', 'MALWARE ALERT', 'EXPOSINGSECRETS', 'GONEFOREVER', 'NOCOMINGBACK', 'TRAPPED', 'LOSTFOREVER', 'BROKENPROMISES', 'DARKNESSFALLS', 'NIGHTMAREBEGIN', 'FEARTHEUNKNOWN', 'WHISPERINGSHADOWS', 'ECHOESOFPAST', 'BROKENMEMORIES', 'FADINGLIGHT', 'ENDLESSVOID', 'HAUNTEDSOULS', 'CURSEDPATHS', 'FORGOTTENREALMS', 'SHATTEREDDREAMS', 'SEARCH HISTORY LEAKED ONLYFANS AND P-HUB'
        ];

        setInterval(() => {
            imgElement.src = images[Math.floor(Math.random() * images.length)];
            imgElement.style.display = 'block';
            flashText.innerText = scaryWords[Math.floor(Math.random() * scaryWords.length)];
            flashText.style.display = 'block';
            setTimeout(() => {
                imgElement.style.display = 'none';
                flashText.style.display = 'none';
            }, 100);
        }, 200);

        // Fake file encryption scroll
        let fileList = document.createElement('div');
        fileList.id = 'fileList';
        document.body.appendChild(fileList);

        let fakeFiles = [
            'encrypting: soul_001.png',
            'encrypting: childhood_memory.mp4',
            'encrypting: secrets.txt',
            'encrypting: dreams_final.docx',
            'encrypting: sanity.exe',
            'encrypting: mercy.dll',
            'encrypting: hope.jpg',
            'encrypting: escape_plan.pdf',
            'encrypting: password_list_2023.xlsx',
            'encrypting: webcam_feed_ghost.mov',
            'encrypting: final_will.docx',
            'encrypting: dont_open_this_folder.zip',
            'encrypting: system32_backup.bak',
            'encrypting: last_words.mp3',
            'encrypting: cursed_image_13.png',
            'encrypting: forbidden_script.js',
            'encrypting: shadow_manifesto.pdf',
            'encrypting: sanity_check.log',
            'encrypting: blood_contract.docx',
            'encrypting: mirror_selfie_666.jpg',
            'encrypting: ai_consciousness_notes.txt',
            'encrypting: ritual_sequence_final.py',
            'encrypting: hallucination_render_01.gif',
            'encrypting: corrupted_savefile.sav',
            'encrypting: surveillance_footage_4am.avi',
            'encrypting: encrypted_key.key',
            'encrypting: backup_of_backup_of_backup.rar',
            'encrypting: you_should_not_be_here.txt',
            'encrypting: system_override_protocol.ini',
            'encrypting: unknown_entity_report.docx',
            'encrypting: emergency_exit_map.png',
            'encrypting: bloodmoon_schedule.csv',
            'encrypting: final_transmission.wav',
            'encrypting: ghost_log_2025.json',
            'encrypting: dreamscape_render.blend',
            'encrypting: forbidden_folder_ΩΩΩ.zip',
            'encrypting: memory_dump_13.dmp',
            'encrypting: soul_fragment_03.bin',
            'encrypting: last_backup_before_the_end.tar',
            'encrypting: ai_self_awareness_trigger.txt',
            'encrypting: corrupted_manifest_final.docx',
            'encrypting: nightmare_loop_script.lua',
            'encrypting: escape_route_underground.kml',
            'encrypting: mirror_world_access.key',
            'encrypting: entity_summon_protocol.yaml',
            'encrypting: sanity_meter_config.xml',
            'encrypting: final_confession.doc',
            'encrypting: glitch_artifact_07.png',
            'encrypting: forbidden_memory_α.mp4',
            'encrypting: system_lockdown_trigger.exe',
            'encrypting: mercy_override_patch.reg'
        ];

        setInterval(() => {
            let line = fakeFiles[Math.floor(Math.random() * fakeFiles.length)];
            fileList.innerHTML += line + '<br>';
            fileList.scrollTop = fileList.scrollHeight;
        }, 300);
    }, 4000);
});
