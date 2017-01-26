<template>
  <div>
    
    <no-active-structure v-if="!$store.state.irs.activeAction" />

    <div v-else class="form">
      <div class="md-title">Entity: {{action.id}}</div>

      <form novalidate @submit.stop.prevent="submit">

        <md-input-container>
          <label>Actioned by</label>
          <md-input v-model="action.by"></md-input>
        </md-input-container>

        <md-input-container>
          <label>Date</label>
          <md-input type="date" v-model="action.date"></md-input>
        </md-input-container>

        <md-input-container>
          <label>Time</label>
          <md-input type="time" v-model="action.time"></md-input>
        </md-input-container>

        <div>
          <label>Action status</label>
          <md-radio v-model="action.actioned" name="actioned" md-value="successfulVisit">Visited, sprayed</md-radio>
          <md-radio v-model="action.actioned" name="actioned" md-value="unsuccessfulVisit">Visited, unsprayed</md-radio>
          <md-radio v-model="action.actioned" name="actioned" md-value="unvisited">Unvisited</md-radio>
        </div>

        <md-button type="submit" class="md-raised md-accent">Save</md-button>
      </form>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'

  import NoActiveStructure from '../no-active-structure.vue'
  import NoTasks from '../no-tasks.vue'

  import {structures, actions} from '../../../db'

  export default {
    name: 'IrsForm',
    data() {
      return {
        // Action should be a copy of the activeAction, so that updating only
        // takes place once 'submitted'
        action: Object.assign({}, this.$store.state.irs.activeAction)
      }
    },
    components: {
      NoActiveStructure,
      NoTasks
    },
    mounted() {
      // structures.get(this.$store.state.irs.activeStructure).then((structure) => {
      //   this.structure = structure
      //   actions.get(structure.action).then((action) => {
      //     let date = moment(action.date)
      //     this.action = Object.assign(action, {
      //       date: date.format('YYYY-MM-DD'),
      //       time: date.format('HH:mm')
      //     })
      //   }).catch((err) => console.log(err))
      // }).catch((err) => console.log(err))
    },
    methods: {
      submit() {
        // TODO: @feature Want to validate before commiting?
        console.log('this')
        // this.$store.dispatch('irs:setActiveAction', this.action)
        // this.$store.dispatch("irs:updateActiveAction", this.action)
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