document.getElementById('changeButton').addEventListener('click', function() {
    const fishGif = document.getElementById('fishGif');
    const originalSrc = 'https://media1.tenor.com/m/R5IECfIf34YAAAAd/fish-spinning.gif';
    const newSrc = 'https://i.ytimg.com/vi/fUAyferAEpA/maxresdefault.jpg'; // New funny fish GIF

    fishGif.src = newSrc;

    setTimeout(() => {
        fishGif.src = originalSrc;
    }, 5000);
});
