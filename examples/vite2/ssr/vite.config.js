import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vitePluginCssModules from '@zebing/vite-plugin-css-modules';
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
    vitePluginCssModules({ styleName: 'classname', autoImport: true })
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
