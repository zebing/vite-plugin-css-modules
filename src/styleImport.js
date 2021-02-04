import { getStyleNameSpace } from './shared';

export const findStyleImport = (ast, types, cssFile) => {
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

    defaultSpecifierNode = types.importDefaultSpecifier(
      types.identifier(getStyleNameSpace())
    )
    
    node.specifiers.unshift(defaultSpecifierNode);
    
    return defaultSpecifierNode;
  });
  
}