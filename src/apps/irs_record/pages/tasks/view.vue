<template>
  <div>
    <h1>TasksView</h1>
    <router-link :to="{name: 'irs_record:clusters'}">back to Clusters</router-link>

    <md-button @click.native="$router.push({name: 'irs_record:tasks:list', params: {cluster_id: $route.params.cluster_id}})">List</md-button>
    <md-button @click.native="$router.push({name: 'irs_record:tasks:map', params: {cluster_id: $route.params.cluster_id}})">Map</md-button>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'TasksView',
    props: ['cluster_id'],
    computed: {
      tasks() {
        const cluster = this.$store.state.irs_record.clusters.find(cluster => cluster._id === cluster_id)
        return this.$store.state.irs_record.tasks.filter(task => this.cluster.task_ids.includes(task._id))
      }
    }
  }
</script>