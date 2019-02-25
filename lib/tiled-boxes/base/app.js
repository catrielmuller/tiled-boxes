const EventEmitter = require('events');
const gameloop = require('node-gameloop');
const calpha = require('color-alpha');

module.exports = class BaseApp extends EventEmitter {
  constructor(props) {
    super();

    this.id = props.id;
    this.name = 'Base App';
    this.icon = calpha('green', 1);
    this.active = false;

    this.device = props.device;

    this.fps = this.device.fps;

    this.size = {
      matrix: this.device.size.matrix,
      aside: this.device.size.aside,
    };

    this.loop = this.loop.bind(this);
  }

  async setup() {
    console.log(`The App: ${this.name} should run a setup`);
    return true;
  }

  async initMatrix() {
    this.matrix = [];
    this.matrixMap = [];
    for (let x = 0; x < this.size.matrix.x; x++) {
      this.matrix[x] = [];
      this.matrixMap[x] = [];
      for (let y = 0; y < this.size.matrix.y; y++) {
        this.matrix[x][y] = calpha('black', 0);
        this.matrixMap[x][y] = null;
      }
    }
    this.aside = Array(this.size.aside).fill(calpha('black', 0));
    this.asideMap = Array(this.size.aside).fill(null);
    return true;
  }

  async init() {
    await this.initMatrix();
    await this.setup();

    this.looper = gameloop.setGameLoop(this.loop, 1000 / this.fps);
  }

  async loop() {
    console.log(`The App: ${this.name} should update on every tick`);
    return true;
  }

  async launch() {
    console.log(`The App: ${this.name} should run the launch operation`);
    return true;
  }
};
