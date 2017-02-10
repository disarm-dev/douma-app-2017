<template>
  <div>
    <h1>TaskView</h1>
    <router-link :to="{name: 'irs_record:tasks', params: {cluster_id: cluster_id}}">back to Tasks</router-link>
    {{task}}
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'TaskView',
    props: ['cluster_id', 'task_id'],
    computed: {
      task() {
        this.$store.state.irs_record.tasks.find(task => task._id === task_id)
      }
    }
  }
</script>