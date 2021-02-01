import { reactive } from 'vue';
import styles from './style.module.css';

export default {
  setup () {
    const data = reactive({
      name: 'test'
    })

    return () => (
      <div class={styles.test}>name: {data.name}</div>
    )
  }
}