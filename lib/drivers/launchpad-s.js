const cparse = require('color-parse');
const calpha = require('color-alpha');
const midi = require('../tiled-boxes/midi');

const BaseDriver = require('../tiled-boxes/base/driver');

module.exports = class LaunchadSDriver extends BaseDriver {
  constructor(props) {
    super(props);

    this.name = 'Launchpad S';
    this.driver = 'launchpad-s';
    this.fps = 5;
    this.size = {
      matrix: { x: 8, y: 8 },
      toolbar: 8,
      aside: 8,
    };

    this.btns = {
      exit: { element: 'toolbar', position: 7 },
    };

    this.props = props;
    this.inputEvent = this.inputEvent.bind(this);
  }

  async initConnection() {
    this.input = new midi.midi.input(); // eslint-disable-line new-cap
    this.output = new midi.midi.output(); // eslint-disable-line new-cap

    if (this.props.inputPort) {
      this.input.openPort(this.props.inputPort);
    } else {
      const inputs = await midi.listInputs(this.name);
      if (inputs[0]) {
        this.input.openPort(inputs[0].id);
      } else {
        return false;
      }
    }
    if (this.props.outputPort) {
      await this.output.openPort(this.props.outputPort);
    } else {
      const output = await midi.listOutputs(this.name);
      if (output[0]) {
        this.output.openPort(output[0].id);
      } else {
        return false;
      }
    }

    this.input.on('message', this.inputEvent);
    await this.initMap();
    return true;
  }

  async initMap() {
    this.map = {};
    this.map.toolbar = [
      { a: 176, b: 104 },
      { a: 176, b: 105 },
      { a: 176, b: 106 },
      { a: 176, b: 107 },
      { a: 176, b: 108 },
      { a: 176, b: 109 },
      { a: 176, b: 110 },
      { a: 176, b: 111 },
    ];

    this.map.aside = [
      { a: 144, b: 8 },
      { a: 144, b: 24 },
      { a: 144, b: 40 },
      { a: 144, b: 56 },
      { a: 144, b: 72 },
      { a: 144, b: 88 },
      { a: 144, b: 104 },
      { a: 144, b: 120 },
    ];

    this.map.matrix = [
      [
        { a: 144, b: 112 },
        { a: 144, b: 96 },
        { a: 144, b: 80 },
        { a: 144, b: 64 },
        { a: 144, b: 48 },
        { a: 144, b: 32 },
        { a: 144, b: 16 },
        { a: 144, b: 0 },
      ],
      [
        { a: 144, b: 113 },
        { a: 144, b: 97 },
        { a: 144, b: 81 },
        { a: 144, b: 65 },
        { a: 144, b: 49 },
        { a: 144, b: 33 },
        { a: 144, b: 17 },
        { a: 144, b: 1 },
      ],
      [
        { a: 144, b: 114 },
        { a: 144, b: 98 },
        { a: 144, b: 82 },
        { a: 144, b: 66 },
        { a: 144, b: 50 },
        { a: 144, b: 34 },
        { a: 144, b: 18 },
        { a: 144, b: 2 },
      ],
      [
        { a: 144, b: 115 },
        { a: 144, b: 99 },
        { a: 144, b: 83 },
        { a: 144, b: 67 },
        { a: 144, b: 51 },
        { a: 144, b: 35 },
        { a: 144, b: 19 },
        { a: 144, b: 3 },
      ],
      [
        { a: 144, b: 116 },
        { a: 144, b: 100 },
        { a: 144, b: 84 },
        { a: 144, b: 68 },
        { a: 144, b: 52 },
        { a: 144, b: 36 },
        { a: 144, b: 20 },
        { a: 144, b: 4 },
      ],
      [
        { a: 144, b: 117 },
        { a: 144, b: 101 },
        { a: 144, b: 85 },
        { a: 144, b: 69 },
        { a: 144, b: 53 },
        { a: 144, b: 37 },
        { a: 144, b: 21 },
        { a: 144, b: 5 },
      ],
      [
        { a: 144, b: 118 },
        { a: 144, b: 102 },
        { a: 144, b: 86 },
        { a: 144, b: 70 },
        { a: 144, b: 54 },
        { a: 144, b: 38 },
        { a: 144, b: 22 },
        { a: 144, b: 6 },
      ],
      [
        { a: 144, b: 119 },
        { a: 144, b: 103 },
        { a: 144, b: 87 },
        { a: 144, b: 71 },
        { a: 144, b: 55 },
        { a: 144, b: 39 },
        { a: 144, b: 23 },
        { a: 144, b: 7 },
      ],
    ];
    return true;
  }

  async subscribeInputs() {
    this.on('input', this.parseInput);
  }

  async parseInput(deviceId, elem) {
    if (deviceId === this.id) {
      if (elem.element === 'toolbar') {
        if (elem.position === 0) {
          this.increaseMatrixOffsetY();
        }
        if (elem.position === 1) {
          this.decreaseMatrixOffsetY();
        }
        if (elem.position === 2) {
          this.decreaseMatrixOffsetX();
        }
        if (elem.position === 3) {
          this.increaseMatrixOffsetX();
        }
      }
    }
    return true;
  }

  async decreaseMatrixOffsetX() {
    if (this.offset.matrix.x >= 1) {
      this.offset.matrix.x -= 1;
      await this.update(this.vmatrix);
    }
    return true;
  }

  async increaseMatrixOffsetX() {
    const lwoffset = this.matrix.length + this.offset.matrix.x;
    if (lwoffset < this.vmatrix.length) {
      this.offset.matrix.x += 1;
      await this.update(this.vmatrix);
    }
    return true;
  }

  async decreaseMatrixOffsetY() {
    if (this.offset.matrix.y >= 1) {
      this.offset.matrix.y -= 1;
      await this.update(this.vmatrix);
    }
    return true;
  }

  async increaseMatrixOffsetY() {
    const lwoffset = this.matrix[0].length + this.offset.matrix.y;
    if (lwoffset < this.vmatrix[0].length) {
      this.offset.matrix.y += 1;
      await this.update(this.vmatrix);
    }
    return true;
  }

  async findToolbarInput(msg) {
    for (let x = 0; x < this.toolbar.length; x += 1) {
      if (this.map.toolbar[x].a === msg[0] && this.map.toolbar[x].b === msg[1]) {
        return {
          element: 'toolbar',
          position: x,
        };
      }
    }
    return false;
  }

  async findAsideInput(msg) {
    for (let x = 0; x < this.aside.length; x += 1) {
      if (this.map.aside[x].a === msg[0] && this.map.aside[x].b === msg[1]) {
        return {
          element: 'aside',
          position: x,
        };
      }
    }
    return false;
  }

  async findMatrixInput(msg) {
    for (let x = 0; x < this.matrix.length; x += 1) {
      for (let y = 0; y < this.matrix[x].length; y += 1) {
        if (this.map.matrix[x][y].a === msg[0] && this.map.matrix[x][y].b === msg[1]) {
          return {
            element: 'matrix',
            position: {
              x: x + this.offset.matrix.x,
              y: y + this.offset.matrix.y,
            },
          };
        }
      }
    }
    return false;
  }

  async inputEvent(deltaTime, msg) {
    if (msg[2] === 127) {
      const toolbar = await this.findToolbarInput(msg);
      if (toolbar) {
        this.emit('input', this.id, toolbar);
        return true;
      }
      const aside = await this.findAsideInput(msg);
      if (aside) {
        this.emit('input', this.id, aside);
        return true;
      }
      const matrix = await this.findMatrixInput(msg);
      if (matrix) {
        this.emit('input', this.id, matrix);
        return true;
      }
    }
    return false;
  }

  async clean() {
    this.offset.matrix.x = 0;
    this.offset.matrix.y = 0;

    for (let x = 0; x < this.toolbar.length; x += 1) {
      this.toolbar[x] = calpha('black', 0);
    }
    for (let x = 0; x < this.aside.length; x += 1) {
      this.aside[x] = calpha('black', 0);
    }
    for (let x = 0; x < this.matrix.length; x += 1) {
      for (let y = 0; y < this.matrix[x].length; y += 1) {
        this.matrix[x][y] = calpha('black', 0);
      }
    }
    return true;
  }

  async image(image) {
    for (let x = 0; x < this.matrix.length; x += 1) {
      for (let y = 0; y < this.matrix[x].length; y += 1) {
        if (image[x] && image[x][y]) {
          this.matrix[x][y] = image[x][y];
        }
      }
    }
  }

  async update(matrix, aside, toolbar) {
    if (toolbar) {
      this.vtoolbar = toolbar;

      for (let x = 4; x < this.toolbar.length; x += 1) {
        if (toolbar[x]) {
          this.toolbar[x] = toolbar[x];
        }
      }
    }

    if (aside) {
      this.vaside = aside;

      for (let x = 0; x < this.aside.length; x += 1) {
        if (aside[x]) {
          this.aside[x] = aside[x];
        }
      }
    }

    if (matrix) {
      this.vmatrix = matrix;

      if ((this.matrix.length + this.offset.matrix.x) > matrix.length) {
        this.offset.matrix.x = 0;
      }
      if ((this.matrix[0].length + this.offset.matrix.y) > matrix[0].length) {
        this.offset.matrix.y = 0;
      }

      if (this.offset.matrix.x > 0) {
        this.toolbar[2] = calpha('green', 0.3);
      } else {
        this.toolbar[2] = calpha('black', 0);
      }

      if (this.offset.matrix.y > 0) {
        this.toolbar[1] = calpha('green', 0.3);
      } else {
        this.toolbar[1] = calpha('black', 0);
      }

      if ((this.matrix.length + this.offset.matrix.x) < matrix.length) {
        this.toolbar[3] = calpha('green', 0.3);
      } else {
        this.toolbar[3] = calpha('black', 0);
      }

      if ((this.matrix[0].length + this.offset.matrix.y) < matrix.length) {
        this.toolbar[0] = calpha('green', 0.3);
      } else {
        this.toolbar[0] = calpha('black', 0);
      }


      for (let x = 0; x < this.matrix.length; x += 1) {
        if (matrix[x]) {
          for (let y = 0; y < this.matrix[x].length; y += 1) {
            if (matrix[x][y]) {
              this.matrix[x][y] = matrix[x + this.offset.matrix.x][y + this.offset.matrix.y];
            }
          }
        }
      }
    }

    return true;
  }

  async updateElm(elm, pixel) {
    if (elm.element === 'toolbar') {
      this.toolbar[elm.position] = pixel;
    }
    if (elm.element === 'aside') {
      this.aside[elm.position] = pixel;
    }
    if (elm.element === 'matrix') {
      this.aside[elm.position.x][elm.position.y] = pixel;
    }
  }

  async render() {
    for (let x = 0; x < this.toolbar.length; x += 1) {
      this.output.sendMessage([
        this.map.toolbar[x].a,
        this.map.toolbar[x].b,
        this.rgbaToCode(this.toolbar[x]),
      ]);
    }

    for (let x = 0; x < this.aside.length; x += 1) {
      this.output.sendMessage([
        this.map.aside[x].a,
        this.map.aside[x].b,
        this.rgbaToCode(this.aside[x]),
      ]);
    }

    for (let x = 0; x < this.matrix.length; x += 1) {
      for (let y = 0; y < this.matrix[x].length; y += 1) {
        this.output.sendMessage([
          this.map.matrix[x][y].a,
          this.map.matrix[x][y].b,
          this.rgbaToCode(this.matrix[x][y]),
        ]);
      }
    }
    return true;
  }

  rgbaToCode(rgba) {
    const color = cparse(rgba);
    if (color.alpha === 0) {
      return 0;
    }
    if (color.values[0] >= color.values[1] && color.values[0] >= color.values[2]) {
      if (color.values[0] === color.values[1]) {
        return 62;
      }
      if (color.values[1] >= 100) {
        if (color.alpha >= 0.5) {
          return 63;
        }
        return 29;
      }
      if (color.alpha >= 0.5) {
        return 15;
      }
      return 13;
    }
    if (color.values[1] >= color.values[0] && color.values[1] >= color.values[2]) {
      if (color.alpha >= 0.5) {
        return 60;
      }
      return 28;
    }
    return 0;
  }
};
