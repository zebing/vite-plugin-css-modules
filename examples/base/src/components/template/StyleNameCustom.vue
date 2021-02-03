<template>
  <div>
    <div>template</div>
    <div classname="test">stylename is custom</div>
    <div classname="test" class="test">class is string</div>
    <div classname="test" :class="{test: true}">class is Object</div>
    <div classname="test" :class="['test']">class is string</div>
    <div classname="test" :class="1 + 1">class is opther</div>
  </div>
</template>
<style module>
.test {
  color: blue;
}
</style>