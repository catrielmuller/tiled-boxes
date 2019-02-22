async function load(configFile) {
  // eslint-disable-next-line
  const devicesConfig = require(configFile);
  return devicesConfig;
}

async function init(devicesConfig, path) {
  const devices = [];
  for (let i = 0; i < devicesConfig.length; i += 1) {
    // eslint-disable-next-line
    const Driver = require(path + devicesConfig[i].driver);
    const { props } = devicesConfig[i];
    props.id = devicesConfig[i].id;
    devices[devicesConfig[i].id] = new Driver(props);
    // eslint-disable-next-line
    await devices[devicesConfig[i].id].init();
  }
  return devices;
}

module.exports = {
  load,
  init,
};
