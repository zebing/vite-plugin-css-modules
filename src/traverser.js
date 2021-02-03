import { solveJSXAttribute, solveObjectAttribute, defaultObjectAttribute } from './resolveAttribute';

export default ({ types, tokens, styleName, stylesId }) => {
  
  return {

    // 遍历template编译的节点属性
    ObjectProperty (path) {
      if (
        path.node.key.name !== styleName || 
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

    // 遍历jsx 节点属性
    JSXAttribute (path) {
      if (
        path.node.key.name !== styleName || 
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

      solveJSXAttribute({
        path, 
        types, 
        stylesId
      });
    }
  }
}