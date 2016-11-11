<template>
  <div>
    <monitor-list v-show="view === 'list'"/>
    <monitor-map v-show="view === 'map'"/>
  </div>
</template>

<script>
  import MonitorList from './list.vue'
  import MonitorMap from './map.vue'

  export default {
    components: {
      'monitor-list': MonitorList,
      'monitor-map': MonitorMap
    },
    computed: {
      view () {
        this.$nextTick( () => this.$emit('show'))
        if (this.$route.name.indexOf('list') >= 0 ) {
          return 'list'
        } else {
          return 'map'
        }
      }
    }
  }
</script>

<style>
  
</style>