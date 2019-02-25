const calpha = require('color-alpha');
const BaseApp = require('../lib/tiled-boxes/base/app');

module.exports = class Shortcut extends BaseApp {

  constructor(props) {
    super(props);
    this.name = 'Google Chrome';

    this.icon = calpha('red', 0.3);

    this.launched = false;
    this.tabs = false;

    this.identity = '';
    if(props.identity) {
      this.identity = props.identity;
    }

    this.parseInputWS = this.parseInputWS.bind(this);
    this.parseInput = this.parseInput.bind(this);
    this.on('input-ws', this.parseInputWS);
    this.on('input', this.parseInput);
  }

  async parseInputWS(msg) {
    if (msg.action === 'google-chrome-identity') {
      if (msg.identity === this.identity) {
        this.launched = true;
      }
    }
    else if (msg.action === 'google-chrome-tabs') {
      if (msg.identity === this.identity) {
        this.tabs = msg.tabs;
      }
    }
    return true;
  }

  async parseInput(msg) {
    if (msg.element === 'matrix') {
      if (this.matrixMap[msg.position.x][msg.position.y]) {
        this.emit('output-ws', {
          action: 'google-chrome-select-tab',
          identity: this.identity,
          tabId: this.matrixMap[msg.position.x][msg.position.y].id,
        });
      }
    } else if (msg.element === 'aside') {
      if (msg.position === (this.size.aside - 1)) {
        this.emit('output-ws', {
          action: 'google-chrome-reload-tab',
          identity: this.identity,
          tabId: 'current',
        });
      }
      if (msg.position === (this.size.aside - 2)) {
        this.emit('output-ws', {
          action: 'google-chrome-goback-tab',
          identity: this.identity,
          tabId: 'current',
        });
      }
      if (msg.position === (this.size.aside - 3)) {
        this.emit('output-ws', {
          action: 'google-chrome-goforward-tab',
          identity: this.identity,
          tabId: 'current',
        });
      }
      if (msg.position === (this.size.aside - 4)) {
        this.emit('output-ws', {
          action: 'google-chrome-remove-tab',
          identity: this.identity,
          tabId: 'current',
        });
      }
      if (msg.position === (this.size.aside - 5)) {
        this.emit('output-ws', {
          action: 'google-chrome-new-tab',
          identity: this.identity,
        });
      }
    }
  }

  async setup() {
    return true;
  }

  async launch() {
    if (this.launched) {
      return true;
    } else {
      return false;
    }
  }

  async isLaunched() {
    if (this.launched) {
      this.icon = calpha('red', 1);
    } else {
      this.icon = calpha('red', 0.3);
    }
  }

  updateMatrix() {
    let counter = 0;
    for (let y = 0; y < this.size.matrix.y; y += 1) {
      for (let x = 0; x < this.size.matrix.x; x += 1) {
        if (this.tabs[counter]) {
          if (this.tabs[counter].active === true) {
            this.matrix[x][y] = calpha('green', 1);
          } else {
            this.matrix[x][y] = calpha('green', 0.3);
          }
          this.matrixMap[x][y] = this.tabs[counter];
        } else {
          this.matrix[x][y] = calpha('black', 0);
          this.matrixMap[x][y] = null;
        }
        counter += 1;
      }
    }
  }

  updateAside(){
    if (this.tabs && this.tabs.length >= 1) {
      this.aside[this.aside.length - 1] = calpha('orange', 0.3);
      this.aside[this.aside.length - 2] = calpha('orange', 0.3);
      this.aside[this.aside.length - 3] = calpha('orange', 0.3);
      this.aside[this.aside.length - 4] = calpha('orange', 0.3);
      this.aside[this.aside.length - 5] = calpha('orange', 0.3);
    } else {
      this.aside[this.aside.length - 1] = calpha('black', 0);
      this.aside[this.aside.length - 2] = calpha('black', 0);
      this.aside[this.aside.length - 3] = calpha('black', 0);
      this.aside[this.aside.length - 4] = calpha('black', 0);
      this.aside[this.aside.length - 5] = calpha('black', 0);
    }
  }

  async loop() {
    await this.isLaunched();
    if (this.launched) {
      this.updateMatrix();
      this.updateAside();
    }
    return true;
  }
};
