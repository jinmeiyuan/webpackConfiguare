<template>
  <div id="container">
    <h1>{{initData}}</h1>
  </div>
</template>
<script>
export default {
  data(){
    return {
      initData:"运行成功123"
    }
  }
}
</script>
<style scoped>
  #container{
    color: red;
  }
</style>