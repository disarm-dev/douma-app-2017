<template>
  <div>
    
    <no-active-structure v-if="!$store.state.irs_progress.activeTask" />

    <div v-else class="form">
      <div class="md-title">Entity: {{task.id}}</div>

      <form novalidate @submit.stop.prevent="submit">

        <md-input-container>
          <label>Actioned by</label>
          <md-input v-model="task.by"></md-input>
        </md-input-container>

        <md-input-container>
          <label>OSM ID (e.g. for structure)</label>
          <md-input type="text" v-model="task.osm_id"></md-input>
        </md-input-container>

        <md-input-container>
          <label>Date</label>
          <md-input type="date" v-model="task.date"></md-input>
        </md-input-container>

        <md-input-container>
          <label>Time</label>
          <md-input type="time" v-model="task.time"></md-input>
        </md-input-container>

        <div>
          <label>Action status</label>
          <md-radio v-model="task.actioned" name="actioned" md-value="successfulVisit">Visited, sprayed</md-radio>
          <md-radio v-model="task.actioned" name="actioned" md-value="unsuccessfulVisit">Visited, unsprayed</md-radio>
          <md-radio v-model="task.actioned" name="actioned" md-value="unvisited">Unvisited</md-radio>
        </div>

        <md-button type="submit" class="md-raised md-accent">Save</md-button>
        <md-button @click.stop.prevent="cancel()" class="md-raised md-warn">Cancel</md-button>
      </form>
    </div>
  </div>
</template>

<script>
  import NoActiveStructure from '../no-active-structure.vue'

  export default {
    name: 'IrsForm',
    data() {
      return {
        task: {}
      }
    },
    components: {
      NoActiveStructure
    },
    watch: {
      // Form is mounted before Task is set so we watch and clone it
      '$store.state.irs_progress.activeTask': 'setTask'
    },
    methods: {
      setTask() {
        // Task should be a copy of the activeTask, so that updating only
        // takes place once 'submitted'
        this.task = Object.assign({}, this.$store.state.irs_progress.activeTask)
      },
      cancel() {
        this.$store.commit("irs:setActiveTask", null)
      },
      submit() {
        // TODO: @feature Want to validate before commiting?
        this.$store.dispatch("irs:updateActiveTask", this.task)
      }
    }
  }
</script>

<style scoped>
  .form {
    max-width: 800px;
    margin: 1em auto;
    padding: 1em;
  }
</style>