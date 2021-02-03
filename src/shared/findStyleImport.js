import defaultOptions from '../defaultOptions';

export const findStyleImport = (path, types, fileId) => {
  const cssFile = defaultOptions.cssFile;

  return path.node.body.filter((node, index ) => {
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
}