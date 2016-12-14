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
  import DumaTabs from './Tabs.vue'

  export default {
    components: {
      DumaTabs
    },
    data() {
      return {
        links: [
          {
            title: 'Monitor',
            name: 'foci:monitor'
          },
          {
            title: 'Identify',
            name: 'foci:identify'
          },
          {
            title: 'Investigate',
            name: 'foci:investigate'
          },
          {
            title: 'Classify',
            name: 'foci:classify'
          },
          {
            title: 'Respond',
            name: 'foci:respond'
          }
        ]
      }
    }
  }
</script>
<style>
  
</style>