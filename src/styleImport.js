import defaultOptions from './defaultOptions';
import { getStyleNameSpace } from './shared';

export const findStyleImport = (ast, types, fileId) => {
  const cssFile = defaultOptions.cssFile;
  let length = ast.program.body.length;
  const styleImports = [];

  for (let index = 0; index < length; index++) {
    const node = ast.program.body[index];

    // 非import节点
    if (types.isImportDeclaration(node)) {
      const fileExp = cssFile.map(value => `\\.${value}`).join('|');

      // 缺省文件后缀
      if (
        /\.module$/gi.test(node.source.value) ||
        new RegExp(`.module(${fileExp})$`, 'gi').test(node.source.value)
      ) {
        styleImports.push(node);
        ast.program.body.splice(index, 1);
        index--;
        length--;
      }
    }
  }

  return styleImports;
}

export const resolveStyleImport = ({ styleImports, types }) => {
  return styleImports.map((node) => {
    let defaultSpecifierNode = 
      node.specifiers.find(specifier => 
        types.isImportDefaultSpecifier(specifier)
      );

    if (defaultSpecifierNode) {
      return defaultSpecifierNode;
    }

    // import styles from 'source' 节点
    const styleImportNode = types.importDeclaration(
      [
        types.importDefaultSpecifier(
          types.identifier(getStyleNameSpace())
        )
      ],
      node.source
    );

    node.specifiers.unshift(styleImportNode);
    
    return styleImportNode;
  });
  
}