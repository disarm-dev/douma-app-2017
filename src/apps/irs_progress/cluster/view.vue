<template>
  <div>
    <h2>View individual cluster</h2>
    <p>Cluster id: {{$route.params.cluster_id}}</p>

    <ul>
      <router-link tag='li' v-for='task in tasks' :to="{name: 'irs_progress:task', params: {cluster_id: cluster_id, task_id: task.id}}">Task id {{task.id}} </router-link>
    </ul>
    
    <md-button @click="$router.push({name: 'irs_progress:cluster:view', params: {cluster_id: $route.params.cluster_id}})">View</md-button>
    <md-button @click="$router.push({name: 'irs_progress:cluster:map', params: {cluster_id: $route.params.cluster_id}})">Map</md-button>
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
        return this.$store.state.irs_progress.tasks.filter((task) => task.id !== -1)
      }
    }
  }
</script>