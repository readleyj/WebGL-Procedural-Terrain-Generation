let gen = new SimplexNoise();
let terrainTheta = 3.5

function getNoise(x, y) {
    return gen.noise2D(x, y) / 2 + 0.5
}

function generateHeight(x, y, width, height) {
    let nx = x / width - 0.5, ny = y / height - 0.5;

    e = (1.00 * getNoise(1 * nx, 1 * ny)
        + 0.50 * getNoise(2 * nx, 2 * ny)
        + 0.25 * getNoise(4 * nx, 4 * ny)
        + 0.13 * getNoise(8 * nx, 8 * ny)
        + 0.06 * getNoise(16 * nx, 16 * ny)
        + 0.03 * getNoise(32 * nx, 32 * ny));
    e /= (1.00 + 0.50 + 0.25 + 0.13 + 0.06 + 0.03);

    return Math.pow(e, terrainTheta);
}

var elevation = []
function generateHeightmap(width, height) {
    for (y = 0; y < height; y++) {
        elevation[y] = []
        for (x = 0; x < width; x++) {
            let nx = x / width - 0.5, ny = y / height - 0.5;

            e = (1.00 * getNoise(1 * nx, 1 * ny)
                + 0.50 * getNoise(2 * nx, 2 * ny)
                + 0.25 * getNoise(4 * nx, 4 * ny)
                + 0.13 * getNoise(8 * nx, 8 * ny)
                + 0.06 * getNoise(16 * nx, 16 * ny)
                + 0.03 * getNoise(32 * nx, 32 * ny));
            e /= (1.00 + 0.50 + 0.25 + 0.13 + 0.06 + 0.03);

            elevation[y][x] = Math.pow(e, 3.5);
        }
    }
}

function biome(e) {
    if (e < 0.15) return WATER;
    else if (e < 0.2) return BEACH;
    else if (e < 0.3) return GRASS;
    else if (e < 0.5) return FORREST;
    else if (e < 0.8) return DESERT;
    else return SNOW;
}