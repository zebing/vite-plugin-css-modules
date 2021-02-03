export * from './checkId';
export * from './resolve';

let id = 1;
export function getStyleNameSpace () {
  return `_styles_vite_plugin_css_module_${id++}`;
}