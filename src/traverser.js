import { solveObjectAttribute, defaultObjectAttribute } from './resolveAttribute';
import { checkStyleName } from './shared';
import traverseSSR from './traverse-ssr';


export default ({ types, tokens, styleName, stylesId }) => {
  
  return {

    // 遍历template编译的节点属性
    ObjectProperty (path) {
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
    },

    TemplateElement (path) {
      const result = traverseSSR({
        tokens,
        html: path.node.value.raw,
        styleName,
        stylesId
      });
      path.node.value = {
        raw: result,
        cooked: result,
      }
    }
  }
}