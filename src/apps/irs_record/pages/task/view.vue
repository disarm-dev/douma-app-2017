<template>
  <div>
    <h1>TaskView</h1>
    {{task}}
    <md-button @click.native="toggle_view">{{toggle_to_view}}</md-button>
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
      },
      toggle_to_view() {
        if (this.$route.meta && this.$route.meta.type === 'show') {
          return 'edit'
        } else {
          return 'show'
        }
      },
    },
    methods: {
      toggle_view() {
        this.$router.push({name: `irs_record:task:${this.toggle_to_view}`, params: {cluster_id: this.cluster_id, task_id: this.task_id}})
      },      
    }
  }
</script>