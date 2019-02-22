const uuidv4 = require('uuid/v4');
const calpha = require('color-alpha');

async function load(configFile) {
  // eslint-disable-next-line
  const appsConfig = require(configFile);
  return appsConfig;
}

async function getMatrixSize(appsConfig, device) {
  const size = {
    x: 0,
    y: 0,
  };
  for (let i = 0; i < appsConfig.length; i += 1) {
    if (device.id === appsConfig[i].device) {
      if (appsConfig[i].position.x > size.x) {
        size.x = appsConfig[i].position.x;
      }
      if (appsConfig[i].position.y > size.y) {
        size.y = appsConfig[i].position.y;
      }
    }
  }
  if (appsConfig.length >= 1) {
    size.x += 1;
    size.y += 1;
  }
  return size;
}

function generateIndexMatrix(apps) {
  const matrix = [];
  for (let x = 0; x < apps.length; x += 1) {
    matrix[x] = [];
    for (let y = 0; y < apps[x].length; y += 1) {
      if (apps[x][y] !== null) {
        matrix[x][y] = apps[x][y].icon;
      } else {
        matrix[x][y] = calpha('black', 0);
      }
    }
  }
  return matrix;
}

async function init(appsConfig, device, path) {
  const size = await getMatrixSize(appsConfig, device);
  const matrix = [];
  for (let x = 0; x < size.x; x += 1) {
    matrix[x] = [];
    for (let y = 0; y < size.y; y += 1) {
      matrix[x][y] = null;
    }
  }
  for (let i = 0; i < appsConfig.length; i += 1) {
    if (appsConfig[i].device === device.id) {
      const appConfig = appsConfig[i];
      // eslint-disable-next-line
      const App = require(path + appConfig.app);
      const props = {
        ...appConfig.props,
      };
      props.id = uuidv4();
      props.device = device;
      matrix[appConfig.position.x][appConfig.position.y] = new App(props);
      matrix[appConfig.position.x][appConfig.position.y].init();
    }
  }
  return matrix;
}


module.exports = {
  load,
  getMatrixSize,
  generateIndexMatrix,
  init,
};
