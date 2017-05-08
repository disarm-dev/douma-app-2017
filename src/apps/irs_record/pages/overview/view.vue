<template>
  <div class='container'>
    <p>You have {{records_count}} clusters, tasks, and records</p>
    <p>This space could contain:</p>
    <ul>
      <li>fullscreen map of everything</li>
      <li>summary table (e.g. tasks to do vs done)</li>
      <li>list of recent/all tasks done --> can edit</li>
      <li>sync status</li>
    </ul>
    <md-button class='md-primary' @click.native='add_new'><md-icon>add</md-icon>Add new record</md-button>
  </div>
</template>

<script>
  export default {
    name: 'Overview',
    data () {
      return {
      }
    },
    computed: {
      records_count() {
        return 0
      }
    },
    methods: {
      add_new() {
        this.$router.push({
          name: 'irs_record:task:edit',
          params: {
            cluster_id: 1,
            task_id: 1,
          }
        })
      }
    }
  }
</script>

<style scoped>
  .container {
    margin: 10px;
  }
</style>