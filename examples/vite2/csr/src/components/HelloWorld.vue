<template>
  <div>
    <h1>{{ msg }}</h1>
    <Test />
    <div class="test">test</div>
    <button @click="state.count++">count is: {{ state.count }}</button>
  </div>
</template>

<script>
import { defineProps, reactive } from 'vue'
import Test from './Test'
import styles from './style.module.css';

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
.test1 {
  color: blue;
}
</style>