import { reactive } from 'vue';
// import styles from './style.module.css';

export default {
  data () {
    return {
      name: 'test'
    }
  },
  render () {
    // console.log(this.name)
    const name = this.name
    return (
      <div>name: test</div>
    )
  }
}