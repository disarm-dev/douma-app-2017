<template>
  <div class='container'>
    <h1>Structure record</h1>
    <p>Use the buttons below to record the spray status of this structure.</p>
    <i>Future versions can have more fields, custom-fields, etc.</i>

    <form>
      <p><md-radio v-model="task.properties.status" name="status" md-value="unvisited">Unvisited</md-radio></p>
      <p><md-radio v-model="task.properties.status" name="status" md-value="visited_successful">Visited and sprayed</md-radio></p>
      <p><md-radio v-model="task.properties.status" name="status" md-value="visited_unsuccessful">Visited and not sprayed</md-radio></p>
      <p><md-radio v-model="task.properties.status" name="status" md-value="visited_unsprayable">Visited, structure is unsprayable</md-radio></p>

      <label>Another field</label>
      <input type="" name="">
      <br/>
      <label>A second other field</label>
      <input type="" name="">
      <br/>

      <md-button class='md-primary md-raised' @click.native='save'><md-icon>save</md-icon><span>Save</span></md-button>
      <md-button @click.native='cancel'><md-icon>cancel</md-icon><span>Cancel</span></md-button>
    </form>

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


<style scoped>
  .container { margin: 10px; }
</style>