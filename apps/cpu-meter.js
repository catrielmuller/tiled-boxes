const calpha = require('color-alpha');
const cpuStats = require('cpu-stats');
const BaseApp = require('../lib/tiled-boxes/base/app');

module.exports = class CpuMeter extends BaseApp {
  constructor(props) {
    super(props);
    this.name = 'Cpu Meter';
    this.icon = calpha('black', 0);
    this.fps = 5;
    this.cpuInfo = null;
    this.getCpuInfo = this.getCpuInfo.bind(this);
  }

  async getCpuInfo() {
    cpuStats(1000, (error, result) => {
      this.cpuInfo = result;
      if (this.cpuInfo.length > this.size.matrix.x) {
        this.size.matrix.x = this.cpuInfo.length;
        this.initMatrix();
      }
    });
    return true;
  }

  async setup() {
    this.getCpuInfo();
    setInterval(this.getCpuInfo, 5000);
    return true;
  }

  async launch() {
    return true;
  }

  async loop() {
    if (this.cpuInfo) {
      if (!this.active) {
        const countCores = this.cpuInfo.length;
        let sum = 0;
        for (let i = 0; i < countCores; i++) {
          sum += this.cpuInfo[i].cpu;
        }
        const avg = sum / countCores;
        if (avg < 25) {
          this.icon = calpha('green', 1);
        } else if (avg < 50) {
          this.icon = calpha('yellow', 1);
        } else if (avg < 75) {
          this.icon = calpha('orange', 1);
        } else {
          this.icon = calpha('red', 1);
        }
      } else {
        for (let x = 0; x < this.matrix.length; x++) {
          for (let y = 0; y < this.matrix[x].length; y++) {
            this.matrix[x][y] = calpha('black', 0);
          }
          if (this.cpuInfo[x]) {
            const core = Math.round((this.size.matrix.y * this.cpuInfo[x].cpu) / 100);
            for (let y = 0; y < core; y++) {
              if (y < (this.size.matrix.y * 0.25)) {
                this.matrix[x][y] = calpha('green', 1);
              } else if (y < (this.size.matrix.y * 0.50)) {
                this.matrix[x][y] = calpha('yellow', 1);
              } else if (y < (this.size.matrix.y * 0.75)) {
                this.matrix[x][y] = calpha('orange', 1);
              } else {
                this.matrix[x][y] = calpha('red', 1);
              }
            }
          }
        }
      }
    }
    return true;
  }
};
