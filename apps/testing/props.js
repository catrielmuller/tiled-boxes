const calpha = require('color-alpha');
const BaseApp = require('../../lib/tiled-boxes/base/app');

module.exports = class Props extends BaseApp {
  constructor(props) {
    super(props);

    this.name = 'Props Test App';
    this.color = 'red';

    if (props.color) {
      this.color = props.color;
    }
    this.icon = calpha(this.color, 1);
  }

  async setup() {
    for (let x = 0; x < this.aside.length; x += 1) {
      this.aside[x] = calpha(this.color, 1);
    }
    for (let x = 0; x < this.matrix.length; x += 1) {
      for (let y = 0; y < this.matrix[x].length; y += 1) {
        this.matrix[x][y] = calpha(this.color, 1);
      }
    }
    return true;
  }

  async launch() {
    return true;
  }

  async loop() {
    return true;
  }
};
