class SDSG {
    constructor(editorEl, previewEl) {
        this.editor = editorEl;
        this.preview = previewEl;
        this.lineNumbers = document.getElementById('lineNumbers');
        this.plugins = {};
        this.pluginStates = {};
        this.templates = {};
        this.assets = {};       // { filename: File }
        this.assetURLs = {};    // { filename: objectURL }
        this.init();
    }

    init() {
        this.editor.addEventListener('input', () => { this.updateLineNumbers(); this.updatePreview(); });
        this.editor.addEventListener('scroll', () => { this.lineNumbers.scrollTop = this.editor.scrollTop; });
        this.updateLineNumbers();
        this.updatePreview();
    }

    updateLineNumbers() {
        const lines = this.editor.value.split('\n').length;
        this.lineNumbers.innerHTML = '';
        for (let i = 0; i < lines; i++) this.lineNumbers.appendChild(document.createElement('div'));
    }

  updatePreview() {
    // Revoke old URLs
    Object.values(this.assetURLs).forEach(url => URL.revokeObjectURL(url));
    this.assetURLs = {};

    // Build object URLs
    for (const [fname, file] of Object.entries(this.assets)) {
        this.assetURLs[fname] = URL.createObjectURL(file);
    }

    // Build asset preview elements
    let assetHTML = "";
    for (const [fname, file] of Object.entries(this.assets)) {
        const url = this.assetURLs[fname];

        if (file.type.startsWith("image/")) {
            assetHTML += `<img src="${url}" alt="${fname}" style="max-width:100%; margin:10px 0;">\n`;
        } else if (file.type.startsWith("audio/")) {
            assetHTML += `<audio controls src="${url}" style="display:block; margin:10px 0;"></audio>\n`;
        } else if (file.type === "text/plain") {
            assetHTML += `<pre id="text_${fname}" style="background:#f9f9f9; padding:5px; border:1px solid #eee; overflow-x:auto; margin:10px 0;"></pre>\n`;
        }
    }

    // Define ASSETS
    let assetScript = "<script>const ASSETS = {};\n";
    for (const [fname, url] of Object.entries(this.assetURLs)) {
        assetScript += `ASSETS["${fname}"] = "${url}";\n`;
    }
    assetScript += "</script>\n";

    // Wrap user HTML properly
    let fullHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            ${assetScript}
        </head>
        <body>
            ${this.editor.value}
            ${assetHTML}
        </body>
        </html>
    `;

    // Handle text assets after document loads
    const textFiles = Object.entries(this.assets).filter(([_, f]) => f.type === "text/plain");

    if (textFiles.length > 0) {
        Promise.all(
            textFiles.map(([fname, file]) => {
                return new Promise(resolve => {
                    const r = new FileReader();
                    r.onload = () => resolve({ fname, content: r.result });
                    r.readAsText(file);
                });
            })
        ).then(results => {
            results.forEach(({ fname, content }) => {
                fullHTML += `
                    <script>
                        document.addEventListener("DOMContentLoaded", () => {
                            const t = document.getElementById("text_${fname}");
                            if (t) t.textContent = ${JSON.stringify(content)};
                        });
                    </script>`;
            });

            this._setPreviewBlob(fullHTML);
        });
    } else {
        this._setPreviewBlob(fullHTML);
    }
}

    _setPreviewBlob(htmlContent) {
        const blob = new Blob([htmlContent], { type: 'text/html' });
        this.preview.src = URL.createObjectURL(blob);
    }

    addAsset(filename, fileBlob) {
        this.assets[filename] = fileBlob;
        this.updatePreview();
    }

    exportGame(name = 'MyGame') {
        const zip = new JSZip();
        zip.file('run.html', this.editor.value);
        for (const [fname, file] of Object.entries(this.assets)) zip.file(fname, file);
        zip.generateAsync({ type: 'blob' }).then(content => saveAs(content, `${name}.zip`));
    }

    registerPlugin(name, fn) {
        this.plugins[name] = fn;
        this.pluginStates[name] = false;
    }

    togglePlugin(name) {
        if (!this.plugins[name]) return;
        if (this.pluginStates[name]) {
            if (this.plugins[name].disable) this.plugins[name].disable();
            this.pluginStates[name] = false;
        } else {
            const disableFn = this.plugins[name](this.editor, this.preview);
            this.plugins[name].disable = disableFn;
            this.pluginStates[name] = true;
        }
    }

    registerTemplate(name, html) { this.templates[name] = html; }

    loadTemplate(name) {
        if (this.templates[name]) {
            this.editor.value = this.templates[name];
            this.updateLineNumbers();
            this.updatePreview();
        }
    }
}

// Initialize global SDK
const sdk = new SDSG(document.getElementById('editor'), document.getElementById('preview'));
