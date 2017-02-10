<template>
  <div>
    <h1>TaskShow</h1>
    <p>Cluster id: {{$route.params.cluster_id}}, Task id: {{ $route.params.task_id}}</p>

    <md-button @click.native="$router.push({name: 'irs_record:task:edit', params: {cluster_id: $route.params.cluster_id, task_id: $route.params.task_id}})">Edit</md-button>

  </div>
</template>

<script>
  export default {
    name: 'TaskShow',
    props: ['cluster_id', 'task_id'],
    computed: {
      task() {
        return this.$store.state.irs_record.tasks.find((task) => task.id === this.$route.params.task_id)
      }
    }
  }
</script>