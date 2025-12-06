class PluginManager {
    constructor(editor, preview) {
        this.editor = editor;
        this.preview = preview;
        this.plugins = {};
        this.activePlugins = {};
        this.effects = {}; // track persistent effects like audio
    }

    registerPlugin(name, description, fn, cleanupFn) {
        // cleanupFn is optional, called on disable
        this.plugins[name] = { description, fn, cleanupFn };
        this.activePlugins[name] = false; // Disabled by default
        this.effects[name] = {};
    }

    enablePlugin(name) {
        if (!this.plugins[name] || this.activePlugins[name]) return;
        this.activePlugins[name] = true;
        this.plugins[name].fn(this.editor, this.preview, this.effects[name]);
        console.log(`${name} enabled`);
    }

    disablePlugin(name) {
        if (!this.plugins[name] || !this.activePlugins[name]) return;
        this.activePlugins[name] = false;

        // Run cleanup function if provided
        if (this.plugins[name].cleanupFn) {
            this.plugins[name].cleanupFn(this.editor, this.preview, this.effects[name]);
        }

        // Reset editor/preview effects
        this.resetEffects(name);
        console.log(`${name} disabled`);
    }

    togglePlugin(name) {
        if (this.activePlugins[name]) this.disablePlugin(name);
        else this.enablePlugin(name);
    }

    resetEffects(name) {
        switch (name) {
            case 'Syntax Highlighting':
            case 'Custom Color Text':
            case 'Spamton':
            case 'GAY Mode':
                this.editor.style.color = '#c9d1d9';
                this.editor.style.background = '#0d1117';
                break;
            case 'Embed':
                this.preview.src = '';
                break;
        }
    }

    isActive(name) {
        return !!this.activePlugins[name];
    }

    listPlugins() {
        return Object.keys(this.plugins);
    }
}


// ==== Init plugin manager ====
const pluginManager = new PluginManager(document.getElementById('editor'), document.getElementById('preview'));



// === Syntax Highlighting ===
pluginManager.registerPlugin('Syntax Highlighting', 'Adds basic syntax highlighting', (editor) => {
    editor.style.color = '#ffcb6b';
});

// === Custom Color Text ===
pluginManager.registerPlugin('Custom Color Text', 'Change text color manually', (editor) => {
    const color = prompt("Enter color for your text (CSS color):");
    if (color) editor.style.color = color;
});

// === Pride Month Mode (fixed) ===
pluginManager.registerPlugin(
    'GAY Mode',
    'TURN GAY!',
    (editor, preview, effects) => {
        effects.originalColor = editor.style.color;
        effects.originalBackground = editor.style.background;

        let hue = 0;
        const speed = 3;
        effects.interval = setInterval(() => {
            hue = (hue + speed) % 360;
            editor.style.color = `hsl(${hue}, 100%, 70%)`;
        }, 50);
    },
    (editor, preview, effects) => {
        if (effects.interval) clearInterval(effects.interval);
        editor.style.color = effects.originalColor || '#c9d1d9';
        editor.style.background = effects.originalBackground || '#0d1117';
    }
);

// === Spamton ===
pluginManager.registerPlugin(
    'Spamton',
    'Pink & Yellow text + spm.ogg audio',
    (editor, preview, effects) => {
        effects.originalColor = editor.style.color;
        editor.style.color = 'yellow';
        editor.style.background = 'pink';
        effects.audio = new Audio('plugin aud/spm.ogg');
        effects.audio.loop = true;
        effects.audio.play();
    },
    (editor, preview, effects) => {
        editor.style.color = effects.originalColor || '#c9d1d9';
        editor.style.background = '#0d1117';
        if (effects.audio) {
            effects.audio.pause();
            effects.audio.currentTime = 0;
            delete effects.audio;
        }
    }
);

// === SoundCloud Player ===
pluginManager.registerPlugin(
    'SoundCloud Player',
    'Play a SoundCloud track',
    async (editor, preview, effects) => {
        const url = prompt('Enter SoundCloud track URL:');
        if (!url) return;

        effects.iframe = document.createElement('iframe');
        effects.iframe.width = "100%";
        effects.iframe.height = "166";
        effects.iframe.scrolling = "no";
        effects.iframe.frameBorder = "no";
        effects.iframe.allow = "autoplay";
        effects.iframe.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=true`;

        effects.iframe.style.position = 'fixed';
        effects.iframe.style.bottom = '10px';
        effects.iframe.style.right = '10px';
        effects.iframe.style.width = '300px';
        effects.iframe.style.height = '80px';
        effects.iframe.style.zIndex = '10000';
        effects.iframe.style.border = '1px solid #58a6ff';
        effects.iframe.style.borderRadius = '6px';
        document.body.appendChild(effects.iframe);
    },
    (editor, preview, effects) => {
        if (effects.iframe) {
            effects.iframe.remove();
            delete effects.iframe;
        }
    }
);

// === Music Player ===
pluginManager.registerPlugin(
    'Music Player',
    'Play a local audio file',
    (editor, preview, effects) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'audio/*';
        fileInput.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;
            effects.audio = new Audio(URL.createObjectURL(file));
            effects.audio.loop = true;
            effects.audio.play();
        };
        fileInput.click();
    },
    (editor, preview, effects) => {
        if (effects.audio) {
            effects.audio.pause();
            effects.audio.currentTime = 0;
            delete effects.audio;
        }
    }
);

// === Diddyblud Mode (fixed) ===
pluginManager.registerPlugin(
    "What is this Diddyblud doing",
    "Plays an audio clip of Diddyblud",
    (editor, preview, effects) => {
        effects.audio = new Audio('plugin aud/diddyblud.mp3');
        effects.audio.loop = true;
        effects.audio.play();
    },
    (editor, preview, effects) => {
        if (effects.audio) {
            effects.audio.pause();
            effects.audio.currentTime = 0;
            delete effects.audio;
        }
    }
);
// ==== Tools Plugins ====
pluginManager.registerPlugin(
    'Live Asset Previewer v2',
    'Displays uploaded images, audio, or text in a new box',
    (editor, preview, effects) => {
        // Create a new container for assets
        const assetContainer = document.createElement('div');
        assetContainer.id = 'assetPreviewContainer';
        assetContainer.style.border = '1px solid #ccc';
        assetContainer.style.padding = '10px';
        assetContainer.style.marginTop = '10px';
        assetContainer.style.maxHeight = '300px';
        assetContainer.style.overflowY = 'auto';
        document.body.appendChild(assetContainer);

        effects.update = (e) => {
            const files = Array.from(e.target.files);
            assetContainer.innerHTML = ''; // Clear previous assets

            files.forEach(file => {
                let element;
                if (file.type.startsWith('image/')) {
                    element = document.createElement('img');
                    element.src = URL.createObjectURL(file);
                    element.style.maxWidth = '100%';
                    element.style.marginBottom = '10px';
                    // Revoke URL when element is removed
                    element.onload = () => URL.revokeObjectURL(element.src);
                } else if (file.type.startsWith('audio/')) {
                    element = document.createElement('audio');
                    element.controls = true;
                    element.src = URL.createObjectURL(file);
                    element.style.display = 'block';
                    element.style.marginBottom = '10px';
                    element.onloadeddata = () => URL.revokeObjectURL(element.src);
                } else if (file.type === 'text/plain') {
                    element = document.createElement('pre');
                    const reader = new FileReader();
                    reader.onload = () => element.textContent = reader.result;
                    reader.readAsText(file);
                    element.style.background = '#f9f9f9';
                    element.style.padding = '5px';
                    element.style.marginBottom = '10px';
                    element.style.border = '1px solid #eee';
                    element.style.overflowX = 'auto';
                } else {
                    // For unsupported types
                    element = document.createElement('p');
                    element.textContent = `Unsupported file type: ${file.name}`;
                    element.style.color = 'red';
                }

                assetContainer.appendChild(element);
            });
        };

        document.getElementById('assetUploader').addEventListener('change', effects.update);

        // Store reference so we can clean up later
        effects.assetContainer = assetContainer;
    },
    (editor, preview, effects) => {
        document.getElementById('assetUploader').removeEventListener('change', effects.update);
        if (effects.assetContainer) effects.assetContainer.remove();
    }
);

// ==== Feedback Plugins ====
pluginManager.registerPlugin(
    'Smart Complainer',
    'Sarcastic console feedback',
    (editor, preview, effects) => {
        effects.handler = () => {
            if (editor.value.trim() === '') console.warn('Nothing here… are you even trying?');
            else if (editor.value.length < 20) console.warn('You call that code? Pathetic.');
            else console.info('Hmm… I guess this is acceptable. Barely.');
        };
        editor.addEventListener('input', effects.handler);
    },
    (editor, preview, effects) => editor.removeEventListener('input', effects.handler)
);

pluginManager.registerPlugin(
    'Achievement Hype',
    'Celebrates unlocked achievements in console',
    (editor, preview, effects) => {
        effects.originalUnlock = Achievements.unlock;
        Achievements.unlock = (name) => {
            console.log(`🎉 Achievement unlocked: ${name}! Epic!`);
            effects.originalUnlock(name);
        };
    },
    (editor, preview, effects) => {
        if (effects.originalUnlock) Achievements.unlock = effects.originalUnlock;
    }
);

// ==== Extreme Madness Plugins ====
pluginManager.registerPlugin(
    'Template Switcher',
    'Switches preview between SDK templates with a button',
    (editor, preview, effects) => {
        const templateNames = Object.keys(sdk.templates);
        let currentIndex = 0;

        // Create the button
        const btn = document.createElement('button');
        btn.textContent = 'Next Template';
        btn.style.position = 'absolute';
        btn.style.top = '10px';
        btn.style.right = '10px';
        btn.style.zIndex = 9999;
        btn.style.padding = '8px 12px';
        btn.style.background = '#00ff99';
        btn.style.color = '#000';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';

        // Append button to the editor container (not preview)
        if (editor && editor.parentNode) {
            editor.parentNode.appendChild(btn);
        } else {
            document.body.appendChild(btn); // fallback
        }

        // Button click switches template
        btn.addEventListener('click', () => {
            preview.srcdoc = sdk.templates[templateNames[currentIndex]];
            currentIndex = (currentIndex + 1) % templateNames.length;
        });

        effects.button = btn;
    },
    (editor, preview, effects) => {
        if (effects.button) effects.button.remove();
    }
);

pluginManager.registerPlugin(
    'Confetti Storm',
    'Non-stop confetti',
    (editor, preview, effects) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
        document.body.appendChild(script);
        script.onload = () => {
            effects.interval = setInterval(() => confetti({
                particleCount: 20,
                spread: 120,
                origin: { y: 0.6 }
            }), 500);
        };
    },
    (editor, preview, effects) => clearInterval(effects.interval)
);
// === Fireworks on Export ===
pluginManager.registerPlugin(
    'Fireworks on Export',
    'Displays a mini fireworks animation when you export your game',
    (editor, preview, effects) => {
        // Override sdk.exportGame to add fireworks effect
        effects.originalExport = sdk.exportGame.bind(sdk);
        sdk.exportGame = (name) => {
            // Run the original export
            effects.originalExport(name);

            // Fireworks effect
            const script = document.createElement('script');
            script.src = './plugin lib/confetti.browser.min.js';
            document.body.appendChild(script);
            script.onload = () => {
                confetti({
                    particleCount: 50,
                    spread: 180,
                    origin: { y: 0.6 }
                });
            };
        };
    },
    (editor, preview, effects) => {
        // Restore original export function
        if (effects.originalExport) sdk.exportGame = effects.originalExport;
    }
);

// === Floating Emojis ===
pluginManager.registerPlugin(
    'Floating Emojis',
    'Random emojis float across the screen',
    (editor, preview, effects) => {
        const emojis = ['😎', '🤯', '🔥', '💥', '🐱‍👤', '🎉', '👾', '🛠️', '💡'];
        effects.interval = setInterval(() => {
            const emojiEl = document.createElement('div');
            emojiEl.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emojiEl.style.position = 'fixed';
            emojiEl.style.top = Math.random() * window.innerHeight + 'px';
            emojiEl.style.left = Math.random() * window.innerWidth + 'px';
            emojiEl.style.fontSize = `${Math.random() * 40 + 20}px`;
            emojiEl.style.pointerEvents = 'none';
            emojiEl.style.zIndex = 9999;
            document.body.appendChild(emojiEl);
            setTimeout(() => emojiEl.remove(), 4000);
        }, 300);
    },
    (editor, preview, effects) => clearInterval(effects.interval)
);


// === Infinite Console Logs ===
pluginManager.registerPlugin(
    'Infinite Console',
    'Spams random messages to the console infinitely',
    (editor, preview, effects) => {
        const messages = ['Hello!', 'Chaos reigns', 'Debugging is futile', 'Epic fail', 'Just kidding', 'You will never win'];
        effects.interval = setInterval(() => {
            console.log(messages[Math.floor(Math.random() * messages.length)]);
        }, 500);
    },
    (editor, preview, effects) => clearInterval(effects.interval)
);

// === Preview Shaker ===

// === Typing Confetti ===
pluginManager.registerPlugin(
    'Typing Confetti',
    'Confetti explodes on every keypress',
    (editor, preview, effects) => {
        const script = document.createElement('script');
        script.src = 'plugin lib/confetti.browser.min.js';
        document.body.appendChild(script);
        script.onload = () => {
            effects.handler = () => confetti({ particleCount: 15, spread: 100, origin: { y: 0.6 } });
            editor.addEventListener('input', effects.handler);
        };
    },
    (editor, preview, effects) => {
        if (effects.handler) editor.removeEventListener('input', effects.handler);
    }
);


