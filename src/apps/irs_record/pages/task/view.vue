<template>
  <div>
    <h1>TaskView</h1>
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
        // return this.$store.state.irs_record.tasks.find(task => task._id === task_id)
      }
    }
  }
</script>