import { dirname, posix, resolve as pathsResolve } from 'path';
import fs from 'fs';
import { resolve, getStyleNameSpace } from './shared';
import { findStyleImport, resolveStyleImport } from './styleImport';
import { Plugin, Alias } from 'vite';

// const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const precss = require('precss');
const postcssModules = require('postcss-modules');
const postcssModulesExtractImports = require('postcss-modules-extract-imports');
const postcssModulesLocalByDefault = require('postcss-modules-local-by-default');
const postcssModulesScope = require('postcss-modules-scope');
const postcssModulesValues = require('postcss-modules-values');

interface Options {
  ast: any, 
  types: any, 
  filePath: string, 
  pluginVue: any, 
  alias: Alias | Alias[], 
  cssFile: string[], 
  autoImport: boolean
}

export default async function({ ast, types, filePath, pluginVue, alias, cssFile, autoImport }: Options) {
  const styleImports = findStyleImport({ ast, types, cssFile, autoImport, dirname: dirname(filePath) });
  if (!styleImports.length) {
    return null;
  }

  // 检查 module 目录
  const baseUrl = pathsResolve(__dirname, 'module')
  if (!fs.existsSync(baseUrl)) {
    fs.mkdirSync(baseUrl);
  }

  // 将import 'url' 转化成 import styles from 'url'形式
  const defaultSpecifiers =  resolveStyleImport({
    styleImports,
    types
  })

  const stylesId = types.identifier(getStyleNameSpace())

  // const styles = Object.assign({}, styles1, styles2,...) 节点
  const node = types.variableDeclaration(
    'const', 
    [
      types.variableDeclarator(
        stylesId,
        types.callExpression(
          types.memberExpression(
            types.identifier('Object'),
            types.identifier('assign'),
          ),
          [
            types.ObjectExpression([]),
            ...defaultSpecifiers.map((node: any) => node.local)
          ]
        )
      )
    ]
  );
  
  const styleNodes = [...styleImports, node]
  ast.program.body.unshift.apply(ast.program.body, styleNodes);
  let cssCode = '';
  
  // 获取css Code
  styleImports.forEach((node: any) => {

    // vue <style></style> 路径
    if (node.source.value.startsWith(filePath)) {
      const cache = pluginVue.load(node.source.value)
      if (cache) {
        cssCode += cache.code;
      }

      // import 引入文件
    } else {
      const url = resolve(node.source.value, {
        exts: cssFile,
        dirname: dirname(filePath),
        alias
      });

      if (url) {
        cssCode += '\n\n' + fs.readFileSync(url, 'utf-8');
      }
    }
  });

  if (cssCode) {
    const from = pathsResolve(baseUrl, posix.basename(filePath));
    const plugins = [
      precss, 
      // autoprefixer, 
      postcssModules,
      postcssModulesExtractImports,
      postcssModulesLocalByDefault,
      postcssModulesScope,
      postcssModulesValues
    ]

    const result = await postcss(plugins).process(cssCode, { from })

    return {
      stylesId,
      tokens: result.messages[0].exportTokens
    }
  }

  return null
}