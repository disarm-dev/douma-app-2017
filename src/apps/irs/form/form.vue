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
          <label>Time</label>
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
  import moment from 'moment'

  import NoActiveStructure from '../no-active-structure.vue'
  import NoTasks from '../no-tasks.vue'

  import {structures, actions} from '../../../db'

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
          this.$store.commit('irs:updateStructure', {structure: this.structure, action: this.action})
        }).catch(err => console.log(err))

        // Looks crazy, but needed to update map
        this.$store.commit('irs:setActiveStructure', '')
        setTimeout(() => {
          this.$store.commit('irs:setActiveStructure', this.structure._id)  
        })
        this.$router.push({ name: 'irs:map'})
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