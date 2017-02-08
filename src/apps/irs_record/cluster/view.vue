<template>
  <div>
    <h2>Tasks for individual cluster</h2>

    <ul>
      <router-link tag='li' v-for='task in tasks' :to="{name: 'irs_record:task', params: {cluster_id: cluster_id, task_id: task._id}}">
        Task id {{task._id}}
      </router-link>
    </ul>
    
    <md-button @click.native="$router.push({name: 'irs_record:cluster:view', params: {cluster_id: $route.params.cluster_id}})">View</md-button>
    <md-button @click.native="$router.push({name: 'irs_record:cluster:map', params: {cluster_id: $route.params.cluster_id}})">Map</md-button>
  </div>
</template>


<script>
  export default {
    name: 'ClusterView',
    computed: {
      cluster_id() {
        return this.$route.params.cluster_id
      },
      tasks(){
        const task_ids = this.$store.state.irs_record.clusters
          .find((cluster) => cluster._id === this.$route.params.cluster_id).task_ids

        return this.$store.state.irs_record.tasks.filter((task) => task_ids.includes(task._id))
      }
    }
  }
</script>