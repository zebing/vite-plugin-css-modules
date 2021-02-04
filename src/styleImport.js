import { getStyleNameSpace } from './shared';
import fs from 'fs';

export const findStyleImport = ({ ast, types, cssFile, autoImport, dirname }) => {
  let length = ast.program.body.length;
  const styleImports = [];

  // 寻找代码里面的import style 节点
  for (let index = 0; index < length; index++) {
    const node = ast.program.body[index];

    // import节点
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

  // 如果代码中没有import style, 且autoImport参数为true,则尝试在该目录下寻找style.module.[cssFile]文件
  if (autoImport) {
    cssFile.forEach((ext) => {
      const url = `${dirname}/style.module.${ext}`;

      if (fs.existsSync(url)) {
        const has = styleImports.find(node => new RegExp(`./style.module.${ext}$`, 'gi').test(node.source.value))
        
        if (!has) {
          const importNode = types.importDeclaration(
            [
              types.importDefaultSpecifier(
                types.identifier(getStyleNameSpace())
              )
            ],
            types.stringLiteral(`./style.module.${ext}`)
          );
          styleImports.push(importNode);
        }
      }
    })
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