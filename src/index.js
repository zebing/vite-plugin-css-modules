import resolveCssModules from './resolveCssModules';
import { checkId } from './shared';
const babel = require('@babel/core');

export default function () {
  let pluginVue;
  let alias;

  return {
    name: 'vite-plugin-css-modules',

    config (config) {
      if (config.alias instanceof Array) {
        alias = config.alias;
      }
      
      config.plugins.forEach(plugin => {
        if (plugin.name === 'vite:vue') {
          pluginVue = plugin;
        }
      });
    },
    
    async transform (code, id) {
      if (!checkId(id)) {
        return;
      }

      const ast = babel.parse(code);
      const cssTokens = await resolveCssModules({
        ast, 
        types: babel.types, 
        filePath: id,
        pluginVue,
        alias
      });
      const res = babel.transformFromAst(ast, { code: true, map: true });
      
      return {
        code: res.code, 
        map: res.map
      }
    }
  }
}