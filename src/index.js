import defaultOptions from './defaultOptions';
const babel = require('@babel/core');
const fs = require('fs')

export default function (pluginVue) {

  return {
    name: 'vite-plugin-css-modules',
    
    transform (code, id) {
      if (!/(\.js|\.jsx|\.vue)$/i.test(id)) {
        return;
      }

      const ids = id
      const ast = babel.parse(code)
      babel.traverse(ast, {
        Program(path) {
          var style0 = {}
          try {
            console.log(pluginVue().load('G:/project/vite-plugin-css-modules/examples/base/src/components/HelloWorld.vue?vue&type=style&index=0&lang.module.css'))
          } catch (err) {
          }
          
          console.log(code, style0)
          console.log(ids)
        }
      })
    }
  }
}