const BaseApp = require('../../lib/tiled-boxes/base/app');

module.exports = class Base extends BaseApp {
  async setup() {
    return true;
  }

  async launch() {
    return false;
  }

  async loop() {
    return true;
  }
};
