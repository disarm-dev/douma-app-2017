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
  import prepareApp from './index.js'

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
    },
    beforeCreate() {
      prepareApp(this.$store.state)
    }
  }
</script>
<style>
  
</style>