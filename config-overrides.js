const path = require('path');

const resolve = (dir) => path.resolve(__dirname, dir);

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.alias,
      '@images': resolve('src/assets/images'),
      '@components': resolve('src/components'),
      '@containers': resolve('src/containers'),
      '@hooks': resolve('src/hooks'),
      '@routes': resolve('src/routes'),
      '@store': resolve('src/store'),
      '@utils': resolve('src/utils'),
      '@services': resolve('src/services'),
    },
  };

  return config;
};
