import './styles.module.css'
import './styles.module.scss'

export default {
  render () {
    return (
      <div>
        <div>jsx</div>
        <div classname="testjsx" >stylename is custom</div>
        <div classname="testjsx" class="test">class is string</div>
        <div classname="testjsx" class={{test: true}}>class is Object</div>
        <div classname="testjsx" class={['test']}>class is string</div>
        <div classname="testjsx" class={1 + 1}>class is opther</div>
        <div classname="testjsxscss" class={1 + 1}>
          class is scss
          <div classname="testjsxscssin" class={1 + 1}>class is scss in</div>
        </div>
      </div>
    )
  }
}