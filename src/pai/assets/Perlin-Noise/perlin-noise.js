class PerlinNoise {
    constructor(seed = Math.random()) {
        this.gradients = new Map();
        this.memory = new Map();
        this.seed = seed;
    }

    randomGradient(ix, iy) {
        const random = 2920 * Math.sin(ix * 21942 + iy * 171324 + 8912 + this.seed) * 
                      Math.cos(ix * 23157 * iy * 217832 + 9758 + this.seed);
        return { 
            x: Math.cos(random), 
            y: Math.sin(random) 
        };
    }

    dotProduct(ix, iy, x, y) {
        const key = `${ix},${iy}`;
        let gradient = this.gradients.get(key);
        
        if (!gradient) {
            gradient = this.randomGradient(ix, iy);
            this.gradients.set(key, gradient);
        }
        
        return (x - ix) * gradient.x + (y - iy) * gradient.y;
    }

    smootherstep(x) {
        return 6 * x**5 - 15 * x**4 + 10 * x**3;
    }

    interpolate(a0, a1, w) {
        const weight = this.smootherstep(w);
        return a0 * (1 - weight) + a1 * weight;
    }

    get(x, y, octaves = 1, persistence = 0.5) {
        const cacheKey = `${x},${y},${octaves},${persistence}`;
        
        if (this.memory.has(cacheKey)) {
            return this.memory.get(cacheKey);
        }

        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;

        for (let i = 0; i < octaves; i++) {
            total += this.getValue(x * frequency, y * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }

        const result = total / maxValue;
        this.memory.set(cacheKey, result);
        return result;
    }

    getValue(x, y) {
        const x0 = Math.floor(x);
        const x1 = x0 + 1;
        const y0 = Math.floor(y);
        const y1 = y0 + 1;

        const sx = x - x0;
        const sy = y - y0;

        const n0 = this.dotProduct(x0, y0, x, y);
        const n1 = this.dotProduct(x1, y0, x, y);
        const ix0 = this.interpolate(n0, n1, sx);

        const n2 = this.dotProduct(x0, y1, x, y);
        const n3 = this.dotProduct(x1, y1, x, y);
        const ix1 = this.interpolate(n2, n3, sx);

        return this.interpolate(ix0, ix1, sy);
    }
}
