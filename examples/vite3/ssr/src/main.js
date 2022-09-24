import App from './App.vue'
import { createSSRApp } from 'vue'

export default function createVueApp() {
  return createSSRApp(App)
}

