module.exports = {
  fps: 30,
  webserver: {
    port: 7348,
  },
  files: {
    apps: `${process.cwd()}/config/apps.json`,
    devices: `${process.cwd()}/config/devices.json`,
  },
  paths: {
    apps: `${process.cwd()}/apps/`,
    drivers: `${process.cwd()}/lib/drivers/`,
    assets: {
      icons: {
        low: `${process.cwd()}/assets/icons/low/`,
      },
    },
  },
};
