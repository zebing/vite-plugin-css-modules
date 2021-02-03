import defaultOptions from './defaultOptions';
import { getStyleNameSpace } from './shared';

export const findStyleImport = (ast, types, fileId) => {
  const cssFile = defaultOptions.cssFile;

  const styleImports = ast.program.body.filter((node, index ) => {
    node.index = index;
    

    // 非import节点
    if (types.isImportDeclaration(node)) {

      // 缺省文件后缀
      if (/\.module$/gi.test(node.source.value)) {
        return true;
      }

      const fileExp = cssFile.map(value => `\\.${value}`).join('|');
      if (new RegExp(`.module(${fileExp})$`, 'gi').test(node.source.value)) {
        return true;
      }
    }

    return false;
  });
  styleImports.forEach(node => {
    ast.program.body.splice(node.index, 1);
    ast.program.body.unshift(node);
  });

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