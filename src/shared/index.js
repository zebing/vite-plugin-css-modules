export * from './checkId';
export * from './resolve';

let id = 1;
export function getStyleNameSpace () {
  return `_styles_vite_plugin_css_module_${id++}`;
}

export const getStyleNameFromNode = (node) => {
  if ('StringLiteral' === node.key.type) {
    return node.key.value;
  }

  return node.key.name;
}

export const checkStyleName = (node, styleName) => {
  let _styleName = node.key.name;

  if ('StringLiteral' === node.key.type) {
    _styleName = node.key.value;
  }

  return _styleName === styleName;
}