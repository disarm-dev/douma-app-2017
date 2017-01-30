<template>
  <div>
    <div :style="containerStyle">
      <duma-tabs :routes="links"></duma-tabs>
      <div>
        <keep-alive>
          <router-view v-if='this.$route.meta.keepRouteAlive'></router-view>
        </keep-alive>
        <router-view v-if='!this.$route.meta.keepRouteAlive'></router-view>
      </div>
    </div>
    <irs-form :style="formStyle"></irs-form>
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
    computed: {
      // We can't use v-if to display form, as this destroys the keep-alive on the map
      // So we hide the from with css instead
      containerStyle() {
        return {display: this.$store.state.irs.activeAction ? 'none' : 'block'}
      },
      formStyle() {
        return {display: this.$store.state.irs.activeAction ? 'block' : 'none'}
      }
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