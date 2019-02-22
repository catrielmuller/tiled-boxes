const fs = require('fs');
const png = require('pngjs').PNG;

async function load(imageFile) {
  const matrix = [];
  // TODO: Validate File
  const dataRaw = fs.readFileSync(imageFile);
  const dataPng = png.sync.read(dataRaw);
  for (let x = 0; x < dataPng.width; x += 1) {
    matrix[x] = [];
    for (let y = 0; y < dataPng.height; y += 1) {
      const idx = (dataPng.width * y + x) << 2; // eslint-disable-line no-bitwise
      matrix[x][y] = `rgba(${
        dataPng.data[idx]},${
        dataPng.data[idx + 1]},${
        dataPng.data[idx + 2]},${
        dataPng.data[idx + 3]})`;
    }
    matrix[x] = matrix[x].reverse();
  }
  return matrix;
}

module.exports = {
  load,
};
