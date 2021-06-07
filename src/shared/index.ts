export * from './checkId';
export * from './query';
export * from './resolve';
export * from './error';

let id: number = 1;
export function getStyleNameSpace (): string {
  return `_styles_vite_plugin_css_module_${id++}`;
}

export const getStyleNameFromNode = (node: any) => {
  if ('StringLiteral' === node.key.type) {
    return node.key.value;
  }

  return node.key.name;
}

export const checkStyleName = (node: any, styleName: string): boolean => {
  let _styleName = node.key.name;

  if ('StringLiteral' === node.key.type) {
    _styleName = node.key.value;
  }

  return _styleName === styleName;
}

export function call(value: any) {
  return Object.prototype.toString.call(value)
}

export function isObject (value: any) {
  return call(value) === "[object Object]";
}

export function isArray (value: any) {
  return call(value) === "[object Array]";
}