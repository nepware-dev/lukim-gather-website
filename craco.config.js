// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const resolve = (dir) => path.resolve(__dirname, dir);

module.exports = {
  webpack: {
    alias: {
      '@images': resolve('src/assets/images'),
      '@components': resolve('src/components'),
      '@containers': resolve('src/containers'),
      '@data': resolve('src/data'),
      '@hooks': resolve('src/hooks'),
      '@routes': resolve('src/routes'),
      '@store': resolve('src/store'),
      '@utils': resolve('src/utils'),
      '@services': resolve('src/services'),
      '@ra': resolve('src/vendor/react-arsenal'),
    },
    configure: {
      ignoreWarnings: [
        {
          module: /node_modules\/html-to-image/,
        },
      ],
    },
  },
  babel: {
    loaderOptions: {
      ignore: ['./node_modules/mapbox-gl/dist/mapbox-gl.js'],
    },
  },
};
