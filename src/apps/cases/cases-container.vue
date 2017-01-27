<template>
  <div>
    <duma-tabs :routes="links"></duma-tabs>
    <div>
      <keep-alive>
        <router-view v-if='this.$route.meta.keepRouteAlive'></router-view>
      </keep-alive>
      <router-view v-if='!this.$route.meta.keepRouteAlive'></router-view>
    </div>
  </div>
</template>
<script>
  import DumaTabs from '../../components/Tabs.vue'

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
          }
        ]
      }
    }
  }
</script>
<style>
  
</style>