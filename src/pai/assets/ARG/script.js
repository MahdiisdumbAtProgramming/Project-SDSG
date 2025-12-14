
        const consoleEl = document.getElementById("console");
        function typeLine(line, callback) {
            let i = 0;
            const interval = setInterval(() => {
                let char = line.charAt(i);
                if (Math.random() < 0.05 && char !== " ") {
                    char = String.fromCharCode(33 + Math.floor(Math.random() * 94));
                    consoleEl.innerHTML += `<span class="glitch">${char}</span>`;
                } else {
                    consoleEl.innerHTML += char;
                }
                i++;
                if (i >= line.length) {
                    clearInterval(interval);
                    consoleEl.innerHTML += "\n";
                    callback();
                }
            }, 50);
        }

        let lineIndex = 0;

        function nextLine() {
            if (lineIndex < storyLines.length) {
                typeLine(storyLines[lineIndex], () => {
                    lineIndex++;
                    setTimeout(nextLine, 400);
                });
            } else {
                window.history.back();
            }
        }

        nextLine();