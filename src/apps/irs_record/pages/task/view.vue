<template>
  <router-view :task="task"></router-view>
</template>

<script>
  export default {
    name: 'TaskView',
    props: ['cluster_id', 'task_id'],
    mounted() {
      const cluster = this.$store.state.irs_tasker.clusters.find(cluster => cluster._id === this.cluster_id)
      this.$store.dispatch("irs_record:set_tasks_for_cluster", cluster)
    },
    watch: {
      '$store.state.irs_record.tasks': 'set_tasks'
    },
    computed: {
      task() {
        return this.$store.state.irs_record.tasks.find(task => task._id === this.task_id)
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
      set_tasks() {
        console.log('set_tasks')
      },
      toggle_view() {
        this.$router.push({name: `irs_record:task:${this.toggle_to_view}`, params: {cluster_id: this.cluster_id, task_id: this.task_id}})
      },      
    }
  }
</script>