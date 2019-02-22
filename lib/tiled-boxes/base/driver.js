const EventEmitter = require('events');
const gameloop = require('node-gameloop');
const calpha = require('color-alpha');

module.exports = class BaseDriver extends EventEmitter {
  constructor(props) {
    super();
    this.id = props.id;
    this.name = 'Base Driver';
    this.driver = 'basedriver';
    this.fps = 30;
    this.size = {
      matrix: { x: 10, y: 10 },
      toolbar: 10,
      aside: 10,
    };

    this.offset = {
      matrix: {
        x: 0,
        y: 0,
      },
      toolbar: 0,
      aside: 0,
    };

    this.btns = {
      exit: { element: 'toolbar', position: 9 },
    };

    this.update = this.update.bind(this);
    this.updateElm = this.updateElm.bind(this);
    this.render = this.render.bind(this);
    this.image = this.image.bind(this);
    this.clean = this.clean.bind(this);
    this.debug = this.debug.bind(this);
    this.loop = this.loop.bind(this);
  }

  async initEvents() {
    this.on('update', this.update);
    this.on('updateElm', this.updateElm);
    this.on('render', this.render);
    this.on('image', this.image);
    this.on('clean', this.clean);
    this.on('debug', this.debug);
    return true;
  }

  async initMatrix() {
    this.matrix = [];
    for (let x = 0; x < this.size.matrix.x; x++) {
      this.matrix[x] = [];
      for (let y = 0; y < this.size.matrix.y; y++) {
        this.matrix[x][y] = calpha('black', 0);
      }
    }
    this.toolbar = Array(this.size.toolbar).fill(calpha('black', 0));
    this.aside = Array(this.size.aside).fill(calpha('black', 0));

    this.vmatrix = [];
    this.vtoolbar = [];
    this.vaside = [];

    return true;
  }

  async initConnection() {
    return true;
  }

  async subscribeInputs() {
    return true;
  }

  async loop() {
    this.render();
    return true;
  }

  async init() {
    await this.initEvents();
    await this.initMatrix();
    await this.initConnection();
    await this.subscribeInputs();
    await this.clean();
    this.looper = gameloop.setGameLoop(this.loop, 1000 / this.fps);
    return true;
  }

  async updateElm(elm, pixel) {
    console.log('The Driver Should update the elm');
  }

  async update(matrix, aside, toolbar) {
    console.log('The Driver Should update the matrix and the toolbar');
  }

  async render() {
    console.log('The Driver Should render the matrix');
  }

  async image(image) {
    console.log('The Driver Should render the image');
  }

  async clean() {
    console.log('The Driver Should clean the display');
  }

  async debug(value) {
    console.log('The Driver Should debug the input value');
  }
};
