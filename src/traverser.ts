import { solveObjectAttribute, defaultObjectAttribute } from './resolveAttribute';
import { checkStyleName } from './shared';
import { transformTemplateAsModule } from './template';

const babel = require('@babel/core');

interface Options {
  pluginVue: any,
  ssr: boolean,
  id: string,
  ast?: any,
  types: any,
  tokens: any,
  styleName: string,
  stylesId: string,
  code?: string
}

export default ({ pluginVue, ssr, id, ast, types, tokens, styleName, stylesId }: Options) => {
  // babel 遍历对象， 非ssr模式
  const babelTraverses = {

    // 遍历template编译的节点属性
    ObjectProperty (path: any) {
      if (
        !checkStyleName(path.node, styleName) || 
        path.node.value.type !== 'StringLiteral' ||
        tokens[path.node.value.value] === undefined
      ) {
        return;
      }

      if (styleName === 'class') {
        defaultObjectAttribute({
          path, 
          types, 
          stylesId
        });

        return;
      }

      solveObjectAttribute({
        path, 
        types, 
        stylesId
      });
    }
  };

  // vue文件 ssr模式
  if (/\.vue$/.test(id) && ssr) {
    const templte = pluginVue.load(`${id}?vue&type=template`);
    const result = transformTemplateAsModule(templte, {
      tokens,
      styleName,
      stylesId
    });
    result.code = 
      result.code.split('\n\n')[1]
      .replace(
        /return (function|const) (render|ssrRender)/,
        '\n$1 _sfc_$2'
      );
    let funcName: any = '';

    // 替换函数
    babel.traverse(ast, {
      FunctionDeclaration (path: any) {
        if (path.node.id.name === '_sfc_ssrRender') {
          funcName = path.scope.generateUidIdentifier('_sfc_ssrRender');
          path.replaceWith(funcName);
        }
      }
    });
    const res = babel.transformFromAst(ast, { code: true, map: false });
    res.code = res.code.replace(funcName.name, result.code);

    return {
      code: res.code,
      map: null
    }
  }

  babel.traverse(ast, babelTraverses);
  return babel.transformFromAst(ast, { code: true, map: true });
}