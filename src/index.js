import resolveCssModules from './resolveCssModules';
import defaultOptions from './defaultOptions';
import { checkId } from './shared';
import traverser from './traverser';
const babel = require('@babel/core');

export default function (config = {}) {
  let pluginVue;
  let alias;
  const {
    styleName = defaultOptions.styleName
  } = config;

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

      if (cssTokens) {
        babel.traverse(ast, traverser({ 
          types: babel.types, 
          tokens: cssTokens.tokens, 
          styleName, 
          stylesId: cssTokens.stylesId 
        }));

        const res = babel.transformFromAst(ast, { code: true, map: true });
        console.log(res.code)
      
        return {
          code: res.code, 
          map: res.map
        }
      }

      return null;
    }
  }
}