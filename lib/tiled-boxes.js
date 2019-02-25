const gameloop = require('node-gameloop');
const deepEqual = require('deep-equal');
const calpha = require('color-alpha');
const express = require('express')();
const http = require('http').Server(express);
const io = require('socket.io')(http);
const config = require('./tiled-boxes/config');
const state = require('./tiled-boxes/state');
const devices = require('./tiled-boxes/devices');
const apps = require('./tiled-boxes/apps');
const images = require('./tiled-boxes/images');
const tools = require('./tiled-boxes/tools');

module.exports = class TiledBoxes {
  constructor() {
    this.loop = this.loop.bind(this);
    this.exit = this.exit.bind(this);
    this.parseInput = this.parseInput.bind(this);
  }

  async parseInput(deviceId, elem) {
    if (this.devices[deviceId].currentAppId === 'index') {
      if (elem.element === 'matrix') {
        if (
          this.devices[deviceId].apps[elem.position.x] &&
          this.devices[deviceId].apps[elem.position.x][elem.position.y] !== null
        ) {
          const enter = await this.devices[deviceId]
            .apps[elem.position.x][elem.position.y].launch();
          if (enter) {
            this.devices[deviceId].currentApp = this.devices[deviceId]
              .apps[elem.position.x][elem.position.y];
            this.devices[deviceId].currentAppId = this.devices[deviceId].currentApp.id;
            this.devices[deviceId].currentApp.active = true;
            this.devices[deviceId].emit('clean');
            this.devices[deviceId].emit('updateElm', this.devices[deviceId].btns.exit, calpha('red', 0.3));
          }
        }
      }
    } else if (deepEqual(this.devices[deviceId].btns.exit, elem)) {
      this.devices[deviceId].currentApp.active = false;
      this.devices[deviceId].currentApp = null;
      this.devices[deviceId].emit('clean');
      this.devices[deviceId].emit('updateElm', this.devices[deviceId].btns.exit, calpha('black', 0));
      this.devices[deviceId].currentAppId = 'index';
    } else {
      this.devices[deviceId].currentApp.emit('input', elem);
    }
    return true;
  }

  async initExitHandler() {
    process.stdin.resume();
    process.on('exit', this.exit);
    process.on('SIGINT', this.exit);
    process.on('SIGUSR1', this.exit);
    process.on('SIGUSR2', this.exit);
    process.on('uncaughtException', this.exit);
  }

  async initWebServer() {
    express.get('/', (req, res) => {
      res.send('<h1>Tiled Boxes WebServer</h1>');
    });

    io.on('connection', (socket) => {
      socket.on('ws', (msg) => {
        console.log(msg);
      });
    });

    await http.listen(this.config.webserver.port);
  }

  async initConfig() {
    this.config = config;
    return true;
  }

  async initState() {
    this.state = state;
    return true;
  }

  async initDevices() {
    const devicesConfig = await devices.load(this.config.files.devices);
    this.devices = await devices.init(devicesConfig, this.config.paths.drivers);
    for (const id in this.devices) {
      this.devices[id].on('input', this.parseInput);
    }
    return true;
  }

  async initApps() {
    const appsConfig = await apps.load(this.config.files.apps);
    for (const id in this.devices) {
      this.devices[id].apps = await apps.init(appsConfig, this.devices[id], this.config.paths.apps);
      this.devices[id].currentAppId = 'index';
      this.devices[id].currentApp = null;
    }
    return true;
  }

  async showLogo() {
    const logoImg = await images.load(`${this.config.paths.assets.icons.low}logo.png`);
    for (const id in this.devices) {
      this.devices[id].emit('image', logoImg);
    }
    await tools.sleep(500);
    return true;
  }

  async loop() {
    for (const id in this.devices) {
      if (this.devices[id].currentAppId === 'index') {
        const matrix = apps.generateIndexMatrix(this.devices[id].apps);
        this.devices[id].emit('update', matrix);
      } else {
        this.devices[id].emit('update', this.devices[id].currentApp.matrix, this.devices[id].currentApp.aside);
      }
    }
    return true;
  }

  async cleanDevices() {
    for (const id in this.devices) {
      this.devices[id].emit('clean');
    }
    return true;
  }

  async init() {
    await this.initExitHandler();
    await this.initConfig();
    await this.initState();
    await this.initWebServer();
    await this.initDevices();
    await this.showLogo();
    await this.initApps();
    await this.cleanDevices();

    this.looper = gameloop.setGameLoop(this.loop, 1000 / this.config.fps);

    return true;
  }

  async exit() {
    gameloop.clearGameLoop(this.looper);
    await this.cleanDevices();
    await tools.sleep(1000);
    process.exit();
    return true;
  }
};
