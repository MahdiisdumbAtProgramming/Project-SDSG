(() => {
    const host = window.chrome?.webview?.hostObjects?.CastielHost;

    const Castiel = {
        _game: null,
        _lastTime: 0,
        _keys: {},
        _mouse: { x:0, y:0, down:false },
        _canvas: null,
        _ctx: null,

        game(def) {
            if (!def || typeof def.update !== 'function') {
                Castiel.speak('Invalid game definition.');
                return;
            }
            Castiel._game = def;
        },

        start() {
            Castiel.speak('Castiel runtime starting');

            Castiel._canvas = document.getElementById('game');
            if (Castiel._canvas) {
                Castiel._ctx = Castiel._canvas.getContext('2d');
                window.addEventListener('keydown', e => Castiel._keys[e.key] = true);
                window.addEventListener('keyup', e => Castiel._keys[e.key] = false);
                Castiel._canvas.addEventListener('mousedown', e => Castiel._mouse.down = true);
                Castiel._canvas.addEventListener('mouseup', e => Castiel._mouse.down = false);
                Castiel._canvas.addEventListener('mousemove', e => {
                    const rect = Castiel._canvas.getBoundingClientRect();
                    Castiel._mouse.x = e.clientX - rect.left;
                    Castiel._mouse.y = e.clientY - rect.top;
                });
            }

            if (Castiel._game?.init) {
                try { Castiel._game.init(); }
                catch (e) { Castiel.speak(e.toString()); }
            }

            requestAnimationFrame(Castiel._loop);
        },

        _loop(time) {
            const dt = (time - Castiel._lastTime) / 1000 || 0;
            Castiel._lastTime = time;

            try {
                Castiel._game?.update?.(dt);
            } catch (e) {
                Castiel.speak(e.toString());
            }

            requestAnimationFrame(Castiel._loop);
        },

        // Logging
        log(msg) {
            Castiel.speak(String(msg));
        },

        speak(msg) {
            console.log('Castiel:', msg);
            host?.CastielSpeak(String(msg));
        },

        // File operations via host
        createFile(path, content) {
            host?.CreateFile(path, String(content));
        },

        readFile(path) {
            return host?.ReadFile(path) ?? '';
        },

        // Canvas drawing helpers
        clear(color='#1e1e1e') {
            if (Castiel._ctx) {
                Castiel._ctx.fillStyle = color;
                Castiel._ctx.fillRect(0, 0, Castiel._canvas.width, Castiel._canvas.height);
            }
        },

        drawRect(x, y, w, h, color='white') {
            if (Castiel._ctx) {
                Castiel._ctx.fillStyle = color;
                Castiel._ctx.fillRect(x, y, w, h);
            }
        },

        drawImage(img, x, y, w, h) {
            if (Castiel._ctx) Castiel._ctx.drawImage(img, x, y, w, h);
        },

        loadImage(src, callback) {
            const img = new Image();
            img.onload = () => callback(img);
            img.src = src;
        },

        // Input access
        keyDown(key) {
            return !!Castiel._keys[key];
        },

        mouse() {
            return { ...Castiel._mouse };
        }
    };

    window.Castiel = Castiel;
    window.addEventListener('load', Castiel.start);
})();