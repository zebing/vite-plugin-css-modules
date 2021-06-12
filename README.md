# @zebing/vite-plugin-css-modules
@zebing/vite-plugin-css-modules 是一个vue css modules智能转化插件。让你在使用vue css modules的同时，无需通过`:class="$style.cssname"`, `class={styles.cssname}`等繁琐的方式调用，而是直接 `class="cssname"`, `class="cssname"`简单调用，极大的减小工作量，增加开发效率。

> 本插件仅适用 vue3.0+。

### 如何使用?
**安装**
```
npm install @zebing/vite-plugin-css-modules --save-dev
```
**使用**

在```vite.config.js``` 配置文件中加入配置
```
import vitePluginCssModules from '@zebing/vite-plugin-css-modules'
export default {
  plugins: [
    vitePluginCssModules()
  ]
}
```

**options**
### Options

|Name|Type|Description|Default|
|---|---|---|---|
|`cssFile`|`array`| css文件类型，不满足为文件将被过滤 |`['css', 'scss', 'less']`|
|`styleName`|`string`| class名称，插件会寻找该名称自动进行转换 |`class`|
|`autoImport`|`boolean`| 自动引入同级目录中的style.module.[css\|scss\|less]文件 | `false` |

### 代码中使用
> 通过 import 引入 css文件，务必在路径中保留文件名后缀， 如 `import './styles.module.css'`

**jsx写法**
```
import './styles.module.css';

export default {
  return (
    <div class="classname"> hello world</div>
  );
}
```
将会自动转换成
```
import styles from './styles.module.css';

export default {
  return (
    <div class={styles.classname}> hello world</div>
  );
}
```

**template写法**
```
<template>
  <div class="classname"> hello world</div>
</template>
<script>
import './styles.module.css';
</script>
<style module>
...
<style>
```
将会自动转换成
```
// 注，此处便于理解，实际已转化成js代码，而非template模板
<template>
  <div :class="$style.classname"> hello world</div>
</template>
<script>
import './styles.module.css';

export default {

}
</script>
<style module>
...
<style>
```

### FAQ 
* templte方式可以通过`import`引入css吗？

  可以。templte通过`<style></style>`或直接`import`都可以。两者都可以共存。

* 如果`class="classname"`在css中并不存在会被转化吗？

  不会。在运行中如果没找到相应的css modules名称，插件将会保留原来的类名`classname`

* `classname`可以和`class`共存吗？
  可以。class支持字符串，数组和对象。`classname`将自动合并到`class`中。
