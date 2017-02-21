<template>
  <div>
    <h1>TaskEdit</h1>

    <div>
      <md-radio v-model="task.properties.status" name="status" md-value="unvisited">Unvisited</md-radio>
      <md-radio v-model="task.properties.status" name="status" md-value="visited_successful">Visited, successful</md-radio>
      <md-radio v-model="task.properties.status" name="status" md-value="visited_unsuccessful">Visited, unsuccessful</md-radio>
      <md-radio v-model="task.properties.status" name="status" md-value="visited_unsprayable">Visited, unsprayable</md-radio>
    </div>

    <md-button @click.native='save'><md-icon>save</md-icon><span>Save</span></md-button>
    <md-button @click.native='cancel'><md-icon>cancel</md-icon><span>Cancel</span></md-button>

  </div>
</template>


<script>
  export default {
    name: 'TaskEdit',
    props: ['cluster_id', 'task_id', 'task'],
    methods: {
      save() {
        // dispatch update action
        this.task.user_id = this.$store.state.meta.user.id
        this.$store.dispatch("irs_record:update_task", this.task).then(() => {
          // navigate back
          this.$router.push({name: 'irs_record:tasks', params: {cluster_id: this.cluster_id}})
        })
      },
      cancel() {
        this.$router.go(-1)
      }
    }
  }
</script>