<template>
  <router-view></router-view>
</template>

<script>
  export default {
    name: 'MetaApplet',
    mounted(){
      console.log('mounted')
    }
  }
</script>

<style scoped>
  .container {
    margin: 10px;
  }
</style>