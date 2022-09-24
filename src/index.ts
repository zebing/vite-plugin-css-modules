import resolveCssModules from './resolveCssModules';
import { checkId, parseVueRequest } from './shared';
import traverser from './traverser';
import { Plugin, Alias } from 'vite';
import { LoadResult, PartialResolvedId } from 'rollup';

const babel = require('@babel/core');

interface Config {
  cssFile?: string[],
  styleName?: string,
  autoImport?: boolean
}

export default function (config: Config = {}) {
  let pluginVue: any;
  let alias: Alias;

  const {
    autoImport = false,
    cssFile = ['css', 'scss', 'less'],
    styleName = 'class'
  }: Config = config;

  return {
    name: 'vite-plugin-css-modules',

    config (config: any) {
      if (config.alias instanceof Array) {
        alias = config.alias;
      }
      
      config.plugins.forEach((plugin: any) => {
        if (plugin.name === 'vite:vue') {
          pluginVue = plugin;
        }
      });
    },

    async transform (code: string, id: string, options: { ssr: boolean } | boolean) {
      const ssr = options?.ssr ?? options;
      if (!checkId(id)) {
        return;
      }
      
      const ast = babel.parse(code);
      const cssTokens = await resolveCssModules({
        ast, 
        types: babel.types, 
        filePath: id,
        pluginVue,
        alias,
        cssFile,
        autoImport
      });

      if (cssTokens) { 
        const res = traverser({ 
          pluginVue,
          ssr,
          id,
          ast,
          types: babel.types, 
          tokens: cssTokens.tokens, 
          styleName, 
          stylesId: cssTokens.stylesId,
          code,
        });

        return {
          code: res.code, 
          map: res.map
        }
      }

      return null;
    }
  }
}