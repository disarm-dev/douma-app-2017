<template>
  <div>
    <duma-tabs :routes="links"></duma-tabs>
    <div>
      <router-view>
    </div>
  </div>
</template>
<script>
  import DumaTabs from './Tabs.vue'

  export default {
    components: {
      DumaTabs
    },
    data() {
      return {
        links: [
          {
            title: 'Monitor Cases',
            name: 'cases:monitor'
          },
        ]
      }
    }
  }
</script>
<style>
  
</style>