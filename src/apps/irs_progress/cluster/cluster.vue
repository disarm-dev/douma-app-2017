<template>
  <div>
    Cluster #XXXXX - map or list (current Tasks list)
    <cluster-map v-show="view === 'map'"></cluster-map>
    <cluster-list v-show="view === 'list'"></cluster-list>
    <md-button @click='cancel'>Cancel</md-button>
  </div>
</template>

<script>
  import ClusterMap from './map.vue'
  import ClusterList from './list.vue'

  export default {
    name: 'Cluster',
    components: {ClusterMap, ClusterList},
    data() {
      return {
        view: 'map'
      }
    },
    methods: {
      cancel() {
        console.log('cancel')
      }
    }
  }  
</script>