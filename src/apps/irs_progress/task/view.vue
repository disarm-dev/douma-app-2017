<template>
  <div>
    <h2>View Task</h2>
    <p>Cluster id: {{$route.params.cluster_id}}, Task id: {{ $route.params.task_id}}</p>

    <md-button @click="$router.push({name: 'irs_progress:task:view', params: {cluster_id: $route.params.cluster_id, task_id: '222'}})">View</md-button>
    <md-button @click="$router.push({name: 'irs_progress:task:edit', params: {cluster_id: $route.params.cluster_id, task_id: '222'}})">Edit</md-button>
  </div>
</template>

<script>
  export default {
    name: 'TaskView',
    computed: {
      task() {
        return this.$store.state.irs_progress.tasks.find((task) => task.id === this.$route.params.task_id)
      }
    }
  }
</script>