import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vitePluginCssModules from '@zebing/vite-plugin-css-modules';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3003
  },
  plugins: [
    viteCommonjs(),
    vue(),
    vueJsx(),
    vitePluginCssModules.default({ styleName: 'classname', autoImport: true })
  ],
  build: {
    minify: false,
  },
  css: {
    modules: {
      scopeBehaviour: 'local'
    }
  }
})
