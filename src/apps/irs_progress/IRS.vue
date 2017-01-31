<template>
  <div>
    <div v-show='!$store.state.irs_progress.activeTask'>
      <duma-tabs :routes="links"></duma-tabs>
      <div>
        <keep-alive>
          <router-view v-if='this.$route.meta.keepRouteAlive'></router-view>
        </keep-alive>
        <router-view v-if='!this.$route.meta.keepRouteAlive'></router-view>
      </div>
    </div>
    <irs-form v-show='$store.state.irs_progress.activeTask'></irs-form>
  </div>
</template>

<script>
  import DumaTabs from '../../components/Tabs.vue'
  import IrsForm from './form/form.vue'

  export default {
    name: 'IrsRoot',
    components: {
      DumaTabs,
      IrsForm
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