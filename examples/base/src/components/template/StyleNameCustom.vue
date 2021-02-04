<template>
  <div>
    <div>template</div>
    <div classname="test">stylename is custom</div>
    <div classname="test" class="test">class is string</div>
    <div classname="test" :class="{test: true}">class is Object</div>
    <div classname="test" :class="['test']">class is string</div>
    <div classname="test" :class="1 + 1">class is opther</div>
    <div classname="testscss" :class="1 + 1">
      class is scss
      <div classname="testscssin" :class="1 + 1">class is scss in</div>
    </div>
    
    <div classname="testless" :class="1 + 1">
      class is less
      <div classname="testlessin" :class="1 + 1">class is lessin</div>
    </div>
    
  </div>
</template>
<style module>
.test {
  color: blue;
}
</style>

<style lang="scss" module>
.testscss {
  color: blue;

  .testscssin {
    color: blue;
  }
}
</style>

<style lang="less" module>
.testless {
  color: blue;

  .testlessin {
    color: blue;
  }
}
</style>