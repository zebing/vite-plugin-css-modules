<template>
  <div>
    <StyleNameClass />
    <StyleNameCustom /> 
    <JSXStyleNameCustom />
    <JSXStyleNameCustomCompositionAPI />
  </div>
</template>

<script>
import StyleNameClass from './components/template/StyleNameClass.vue'
import StyleNameCustom from './components/template/StyleNameCustom.vue'
import JSXStyleNameCustom from './components/jsx/JSXStyleNameCustom'
import JSXStyleNameCustomCompositionAPI from './components/jsx/JSXStyleNameCustomCompositionAPI'

export default {
  components: { 
    StyleNameClass,
    StyleNameCustom,
    JSXStyleNameCustom,
    JSXStyleNameCustomCompositionAPI
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>