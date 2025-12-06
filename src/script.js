const scenes = [
    { text: "MAHDIISDUMB", image: "introresources/Mahdiisdumb.webp" },
    { text: "Mahdi Studios Presents...", image: "introresources/Mahdi Studios Logo.png" },
    { text: "PROJECT SDSG", image: "introresources/SDSG Logo.jpeg" },

    // Short summary lines
    {
        text: "Project SDSG (Project School Defying Software Games[Codename:Games&Goofy]).",
        image: "introresources/SDSG Logo.jpeg"
    },
    {
        text: "A portable collection of lightweight HTML5 games and tools designed to run locally fast, offline, and easy to use.",
        image: "introresources/SDSG Logo.jpeg"
    },
    {
        text: "Maintained by Mahdiisdumb under Mahdi Studios. Explore, contribute, and enjoy the offline experience.",
        image: "introresources/Mahdi Studios Logo.png"
    },
    {
        text: "Ready? Let's START SDSG.",
        image: "introresources/SDSG Logo.jpeg"
    }
];

        const textBox = document.getElementById("text-box");
        const sceneImg = document.getElementById("scene-img");
        let sceneIndex = 0;
        let charIndex = 0;
        let currentLine = '';
        let typing = true;

        function typeScene() {
            if (sceneIndex >= scenes.length) {
                setTimeout(redirect, 2000);
                return;
            }

            const scene = scenes[sceneIndex];
            const line = scene.text;

            if (charIndex === 0) {
                textBox.innerText = '';
                sceneImg.style.display = 'none';
                sceneImg.src = scene.image;
                setTimeout(() => {
                    sceneImg.style.display = 'block';
                }, 300);
            }

            if (charIndex < line.length) {
                currentLine += line[charIndex];
                textBox.innerText = currentLine;
                charIndex++;
                setTimeout(typeScene, 40);
            } else {
                currentLine = '';
                charIndex = 0;
                sceneIndex++;
                setTimeout(typeScene, 1000);
            }
        }

        function redirect() {
            window.location.href = './pai/load.html';
        }

        window.onload = () => {
            document.getElementById("intro-audio").play();
            typeScene();
        };