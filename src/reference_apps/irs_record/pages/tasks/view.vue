<template>
  <div style="position:relative">
    <div class='container'>
      <h1>Tasks for Cluster</h1>
      <p>The map below shows the structures within this Cluster. Click on the one you are currently attending to, in order to record progress against it.</p>
      <i>Future versions will have a user-location marker.</i>
    </div>    
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'TasksView',
    props: ['cluster_id'],
    mounted() {
      if (this.$store.state.irs.clusters.length > 0) this.set_tasks_for_cluster()
    },
    watch: {
      '$store.state.irs_tasker.clusters': 'set_tasks_for_cluster'
    },
    computed: {
      toggle_to_view() {
        if (this.$route.meta && this.$route.meta.type === 'map') {
          return 'list'
        } else {
          return 'map'
        }
      }
    },
    methods: {
      set_tasks_for_cluster() {
        console.log('set_tasks_for_cluster')
        const cluster = this.$store.state.irs.clusters.find(cluster => cluster._id === this.cluster_id)
        if(cluster) this.$store.dispatch("irs_record:set_tasks_for_cluster", cluster)
      },
      toggle_view() {
        this.$router.push({name: `irs_record:tasks:${this.toggle_to_view}`, params: {cluster_id: this.cluster_id}})
      },
      navigate(route) {
        this.$router.push({name: `irs_record:tasks:${route}`, params: {cluster_id: this.cluster_id}})
      },
    }
  }
</script>


<style scoped>
  .container { margin: 10px; }
</style>