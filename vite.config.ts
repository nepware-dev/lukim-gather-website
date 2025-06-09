import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

const resolvePath = (pathStr) => new URL(pathStr, import.meta.url).pathname;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@images': resolvePath('./src/assets/images'),
      '@components': resolvePath('./src/components'),
      '@containers': resolvePath('./src/containers'),
      '@data': resolvePath('./src/data'),
      '@hooks': resolvePath('./src/hooks'),
      '@routes': resolvePath('./src/routes'),
      '@store': resolvePath('./src/store'),
      '@utils': resolvePath('./src/utils'),
      '@services': resolvePath('./src/services'),
      '@ra': resolvePath('./src/vendor/react-arsenal'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
  },
});
