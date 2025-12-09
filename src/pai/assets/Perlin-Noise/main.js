let currentSeed = '';

function generateRandomSeed() {
    // Generate a 19-digit seed
    return Math.floor(Math.random() * 9000000000000000000) + 1000000000000000000;
}

function generateNoiseMap(seed = '') {
    const canvas = document.getElementById('noiseCanvas');
    const ctx = canvas.getContext('2d');

    // Use provided seed or generate random one
    currentSeed = seed || generateRandomSeed();
    
    // Ensure seed is 19 digits
    currentSeed = BigInt(currentSeed) % 9000000000000000000n + 1000000000000000000n;
    
    document.getElementById('seedInput').value = currentSeed.toString();
    document.getElementById('seedValue').textContent = currentSeed.toString();

    // Create noise generators with deterministic seeds derived from main seed
    const perlin1 = new PerlinNoise(Number(currentSeed % 1000000n));
    const perlin2 = new PerlinNoise(Number((currentSeed / 1000000n) % 1000000n));
    const perlin3 = new PerlinNoise(Number((currentSeed / 1000000000n) % 1000000n));

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);

    const scale = 100;
    const octaves = 4;
    const persistence = 0.5;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const value1 = perlin1.get(x / scale, y / scale, octaves, persistence);
            const value2 = perlin2.get(x / scale, y / scale, octaves, persistence);
            const value3 = perlin3.get(x / scale, y / scale, octaves, persistence);
            
            const combinedValue = (value1 * 0.5 + value2 * 0.3 + value3 * 0.2 + 1) / 2 * 255;
            
            const cell = (x + y * width) * 4;
            imageData.data[cell] = combinedValue;
            imageData.data[cell + 1] = combinedValue;
            imageData.data[cell + 2] = combinedValue;
            imageData.data[cell + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

// Event Listeners
document.getElementById('generateBtn').addEventListener('click', () => {
    const seedInput = document.getElementById('seedInput').value;
    generateNoiseMap(seedInput);
});

document.getElementById('randomSeedBtn').addEventListener('click', () => {
    generateNoiseMap();
});

// Initial generation
generateNoiseMap();
