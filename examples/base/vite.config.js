import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
const vitePluginCssModules = require('../../dist/index.js').default
console.log('vitePluginCssModules', vitePluginCssModules)
/**
 * https://vitejs.dev/config/
 * @type {import('vite').UserConfig}
 */
export default {
  server: {
    port: 3003
  },
  plugins: [
    vue(),
    vueJsx(),
    vitePluginCssModules(vue)
  ],
  build: {
    minify: false,
  },
  css: {
    modules: {
      scopeBehaviour: 'local'
    }
  }
}
