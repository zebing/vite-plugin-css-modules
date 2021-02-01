<template>
  <h1>{{ msg }}</h1>
  <Test />
  <div :class="$style.test">test</div>
  <button @click="state.count++">count is: {{ state.count }}</button>
  <p>
    Edit12
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
</template>

<script>
import { defineProps, reactive } from 'vue'
import Test from './Test'

export default {
  components: { Test },
  setup() {
    defineProps({
      msg: String
    })

    const state = reactive({ count: 0 })
    return {
      state
    }
  }
}
</script>

<style module>
a {
  color: #42b983;
}
.test {
  color: blue;
}
</style>