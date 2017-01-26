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
    name: 'IrsRoot',
    components: {
      DumaTabs
    },
    data() {
      return {
        links: [
          {
            title: 'Tasks',
            name: 'irs:tasks'
          },
          {
            title: 'Map',
            name: 'irs:map'
          },
          {
            title: 'Form',
            name: 'irs:form'
          },
          {
            title: 'Sync',
            name: 'irs:sync'
          }
        ]
      }
    }
  }
</script>

<style>
</style>