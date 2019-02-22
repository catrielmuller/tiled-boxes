const TiledBoxes = require('./lib/tiled-boxes');

async function run() {
    const tiledBoxes = new TiledBoxes();
    await tiledBoxes.init();
}

run();
