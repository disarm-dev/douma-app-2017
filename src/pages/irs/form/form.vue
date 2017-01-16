<template>
  <div>
    
    <no-active-structure v-if="!$store.state.irs.activeStructure" />

    <div v-else class="form">
      <div class="md-title">Structure: {{structure.id}}</div>

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
          <label>Date</label>
          <md-input type="time" v-model="action.time"></md-input>
        </md-input-container>

        
        
        <div>
          <md-checkbox v-model="action.actioned">Actioned?</md-checkbox>
        </div>

        <md-button type="submit" class="md-raised md-accent">Save</md-button>
      </form>
    </div>
  </div>
</template>

<script>
  import PouchDB from 'pouchdb'
  import moment from 'moment'

  import NoActiveStructure from '../../../components/no-active-structure.vue'
  import NoTasks from '../../../components/no-tasks.vue'

  const structures = new PouchDB('structures')
  const actions = new PouchDB('actions')

  export default {
    data() {
      return {
        // Structure should be a copy of the activeStructure, so that updating only
        // takes place once 'submitted'
        structure: {},
        action: {}
      }
    },
    components: {
      NoActiveStructure,
      NoTasks
    },
    mounted() {
      structures.get(this.$store.state.irs.activeStructure).then((structure) => {
        this.structure = structure
        actions.get(structure.action).then((action) => {
          let date = moment(action.date)
          this.action = Object.assign({
            date: date.format('YYYY-MM-DD'),
            time: date.format('HH:mm')
          }, action)
        })
      })
    },
    methods: {
      submit(e) {
        let {_id, _rev, actioned, by, date, time} = this.action
        date = moment(`${date} ${time}`).toDate()
        actions.put({
          _id,
          _rev,
          actioned,
          by,
          date
        }).then((res) => {
          this.action._rev = res.rev
        })
        this.$store.commit('irs:setActiveStructure', '')
        this.$store.commit('irs:setActiveStructure', this.structure._id)
        //this.$store.commit('irs:updateStructure', this.structureCopy)
        // history.back()
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