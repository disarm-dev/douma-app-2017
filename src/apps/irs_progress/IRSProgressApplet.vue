<template>
  <router-view></router-view>
</template>

<script>
  export default {
    name: 'IrsProgressApplet',
    mounted() {
      // Launch the IRS Progress app, by loading the local data from 
      console.log('load Clusters, Tasks, SpatialEntities from local store')
      // this.$store.dispatch('irs_progress:retrieveTasks')
      // this.$store.dispatch('irs_progress:retrieveStructures')
      this.$store.dispatch('irs_progress:loadClusters')
    }
  }
</script>
