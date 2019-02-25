const calpha = require('color-alpha');
const robot = require('robot-js');
const BaseApp = require('../lib/tiled-boxes/base/app');

module.exports = class Shortcut extends BaseApp {

  constructor(props) {
    super(props);
    this.name = 'Google Chrome';

    this.icon = calpha('red', 0.3);

    this.keyboard = robot.Keyboard();
    this.launched = false;
  }

  async setup() {
    return true;
  }

  async launch() {
    let windows = robot.Window.getList('.*Google Chrome.*');
    console.log(windows[0].getTitle());
    let process = windows[0].getProcess();
    console.log(process.getPID());
    console.log(process.getName());
    console.log(process.getPath());
    robot.Window.setActive(windows[0]);
    return false;
  }

  async isLaunched() {
    if (this.launched) {
      this.icon = calpha('red', 1);
    } else {
      this.icon = calpha('red', 0.3);
    }
  }

  async loop() {
    await this.isLaunched();
    return true;
  }
};
