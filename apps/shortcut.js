const calpha = require('color-alpha');
const robot = require('robot-js');
const BaseApp = require('../lib/tiled-boxes/base/app');

module.exports = class Shortcut extends BaseApp {

  constructor(props) {
    super(props);
    this.name = 'Shortcut';

    this.color = 'green';
    if (props.color) {
      this.color = props.color;
    }
    this.opacity = '1';
    if (props.color) {
      this.opacity = props.opacity;
    }
    this.icon = calpha(this.color, this.opacity);
    this.keyboard = robot.Keyboard();

    this.comand = false;
    if (props.keys) {
      this.keys = props.keys;
    }
  }

  async setup() {
    return true;
  }

  async launch() {
    if (this.keys) {
      this.keyboard.click(this.keys);
    }
    return false;
  }

  async loop() {
    return true;
  }
};
