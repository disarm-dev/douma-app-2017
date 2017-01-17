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
            title: 'Tasks',
            name: 'irs:tasks'
          },
          {
            title: 'Map',
            name: 'irs:map'
          },
          {
            title: 'List',
            name: 'irs:list'
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