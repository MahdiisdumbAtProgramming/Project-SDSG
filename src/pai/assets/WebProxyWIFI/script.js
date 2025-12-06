function formatUrl(url) {
    url = url.trim().replace(/^(https?:\/\/)?(www\.)?/, '');
    return 'https://' + url;
}

document.getElementById('fetchBtn').addEventListener('click', () => {
    const input = document.getElementById('urlInput').value;
    if (!input) return;
    const formatted = formatUrl(input);
    document.getElementById('proxyFrame').src = formatted;
});

document.getElementById('urlInput').addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        document.getElementById('fetchBtn').click();
    }
});