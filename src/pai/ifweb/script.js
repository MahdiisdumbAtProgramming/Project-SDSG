// SDSG download page script.
// - Fetches repository README to display a short description (raw GitHub URL).
// - Periodically refetches README and supports manual refresh.
// - Attempts to download a local SDSG-local.zip, falls back to repository archive.
// - Keeps UI status updates and uses exponential backoff on failures.

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('dwnld');
    const status = document.getElementById('status');
    const repoDescriptionEl = document.getElementById('repoDescription');
    const repoInfoContainer = document.getElementById('repoInfo');

    const localFilename = './SDSG-local.zip';
    const fallbackUrl = 'https://drive.google.com/file/d/19e4R1z6SzwXlGM_rBYfKCSesQn2TQjr2/view?usp=sharing';
    const readmeRawUrl = 'https://raw.githubusercontent.com/Mahdiisdumb/Project-SDSG/refs/heads/master/README.md';

    // Refresh configuration
    const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
    const INITIAL_BACKOFF_MS = 2000; // 2s
    const MAX_BACKOFF_MS = 5 * 60 * 1000; // 5 minutes

    let backoffMs = INITIAL_BACKOFF_MS;
    let periodicTimer = null;
    let lastSuccessfulFetch = 0;

    // Create manual refresh button if not present
    function ensureRefreshButton() {
        if (document.getElementById('refreshRepoBtn')) return;
        const refreshBtn = document.createElement('button');
        refreshBtn.id = 'refreshRepoBtn';
        refreshBtn.type = 'button';
        refreshBtn.textContent = 'Refresh repository info';
        refreshBtn.style.marginLeft = '12px';
        refreshBtn.style.padding = '6px 10px';
        refreshBtn.style.fontSize = '13px';
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.disabled = true;
            status.textContent = 'Refreshing repository info...';
            const ok = await performFetch();
            status.textContent = ok ? 'Repository info updated.' : 'Repository info refresh failed.';
            refreshBtn.disabled = false;
        });

        // place button next to the repo info header
        if (repoInfoContainer) {
            repoInfoContainer.querySelector('strong')?.after(refreshBtn);
        } else {
            // fallback: append to body
            document.body.appendChild(refreshBtn);
        }
    }

    // Fetch README.md from GitHub raw and extract the first paragraph for display.
    async function fetchRepoDescription() {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

        try {
            const res = await fetch(readmeRawUrl, { cache: 'no-cache', signal: controller.signal });
            clearTimeout(timeout);
            if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
            const text = await res.text();

            // Extract first non-empty paragraph (split by blank lines)
            const paragraphs = text.split(/\r?\n\r?\n/).map(p => p.trim()).filter(Boolean);
            const first = paragraphs.length ? paragraphs[0] : text.trim().split(/\r?\n/)[0] || '';
            // sanitize minimal markdown: remove leading '#', trim
            const cleaned = first.replace(/^#+\s*/, '').trim();
            if (repoDescriptionEl) {
                repoDescriptionEl.textContent = cleaned || 'No short description found in README.';
                // remove any prior note to avoid duplicates
                const existingNote = repoDescriptionEl.parentNode.querySelector('.repo-note');
                if (existingNote) existingNote.remove();
                const note = document.createElement('div');
                note.className = 'repo-note';
                note.style.marginTop = '8px';
                note.style.fontSize = '13px';
                note.style.color = '#555';
                note.textContent = 'This description was fetched from the project README to provide context for local vs web trade-offs.';
                repoDescriptionEl.parentNode.appendChild(note);
            }

            // If README references offline/local/assets/games add a specific advantage line (avoid duplicates)
            if (/offline|local|assets|games/i.test(text)) {
                const localAdvantages = document.getElementById('localAdvantages');
                if (localAdvantages && !document.getElementById('repoContentAdvantage')) {
                    const li = document.createElement('li');
                    li.id = 'repoContentAdvantage';
                    li.innerHTML = '<strong>Repository content:</strong> The repository includes assets and files that benefit from being stored locally to avoid network restrictions.';
                    localAdvantages.appendChild(li);
                }
            }

            lastSuccessfulFetch = Date.now();
            // reset backoff on success
            backoffMs = INITIAL_BACKOFF_MS;
            return true;
        } catch (err) {
            clearTimeout(timeout);
            // don't overwrite a previously fetched description with an error message; show a subtle hint instead
            if (repoDescriptionEl && !repoDescriptionEl.textContent.trim()) {
                repoDescriptionEl.textContent = 'Could not load repository description. You can still download the local package below.';
            }
            return false;
        }
    }

    // Perform a fetch with backoff on failure
    async function performFetch() {
        const ok = await fetchRepoDescription();
        if (!ok) {
            // schedule a retry with exponential backoff (capped)
            const wait = Math.min(backoffMs, MAX_BACKOFF_MS);
            backoffMs = Math.min(backoffMs * 2, MAX_BACKOFF_MS);
            setTimeout(() => {
                performFetch();
            }, wait);
        }
        return ok;
    }

    // Start periodic refetch timer
    function startPeriodicRefresh() {
        if (periodicTimer) return;
        periodicTimer = setInterval(() => {
            // avoid fetching too frequently if a recent successful fetch occurred
            if (Date.now() - lastSuccessfulFetch < Math.min(REFRESH_INTERVAL_MS, 30000)) return;
            performFetch();
        }, REFRESH_INTERVAL_MS);
    }

    // Stop periodic refresh (exposed for future use)
    function stopPeriodicRefresh() {
        if (periodicTimer) {
            clearInterval(periodicTimer);
            periodicTimer = null;
        }
    }

    async function downloadUrl(url, suggestedName) {
        try {
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const blob = await resp.blob();
            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(blob);
            a.href = objectUrl;
            a.download = suggestedName || '';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(objectUrl);
            return true;
        } catch (err) {
            return false;
        }
    }

    btn.addEventListener('click', async () => {
        status.textContent = 'Preparing download...';
        // First attempt: local package
        const gotLocal = await downloadUrl(localFilename, 'SDSG-local.zip');
        if (gotLocal) {
            status.textContent = 'Download started: SDSG-local.zip';
            return;
        }

        // Fallback: remote repository archive
        status.textContent = 'Local package not found — falling back to repository archive.';
        const gotFallback = await downloadUrl(fallbackUrl, 'Project-SDSG-master.zip');
        if (gotFallback) {
            status.textContent = 'Fallback download started: Project-SDSG-master.zip';
            return;
        }

        status.textContent = 'Automatic download failed. Opening repository page in a new tab.';
        window.open('https://drive.google.com/file/d/19e4R1z6SzwXlGM_rBYfKCSesQn2TQjr2/view?usp=sharing', '_blank', 'noopener');
    });

    // Init: ensure refresh control, initial fetch, and periodic refresh
    ensureRefreshButton();
    performFetch().then(ok => {
        status.textContent = ok ? 'Repository info loaded.' : 'Repository info unavailable.';
        startPeriodicRefresh();
    });
});