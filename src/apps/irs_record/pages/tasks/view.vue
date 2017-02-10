<template>
  <div>
    <h1>TasksView</h1>
    <md-button @click.native="$router.push({name: 'irs_record:tasks:list', params: {cluster_id: $route.params.cluster_id}})">List</md-button>
    <md-button @click.native="$router.push({name: 'irs_record:tasks:map', params: {cluster_id: $route.params.cluster_id}})">Map</md-button>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'TasksView',
    props: ['cluster_id'],
    mounted() {
      // Find Cluster from URL params, and get matching Tasks and Spatial Entities. Need to wait until parent calls `mounted()` to ensure $store.clusters is set 
      this.$store.dispatch("irs_record:set_tasks_and_spatial_entities_for_cluster", this.cluster_id)
    }
  }
</script>