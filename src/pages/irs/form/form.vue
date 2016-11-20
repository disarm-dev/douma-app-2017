<template>
  <div>
    <div v-if="$store.state.irs.structures == false || !$store.getters.activeStructure">
      <no-tasks v-if="$store.state.irs.structures == false" />
      <no-active-structure v-if="$store.state.irs.structures != false && !$store.getters.activeStructure" />
    </div>
    <div v-else class="form">
      <div class="md-title">Structure: {{structure.id}}</div>

      <form novalidate @submit.stop.prevent="submit">

        <md-input-container>
          <label>Actioned by</label>
          <md-input v-model="structure.actionBy"></md-input>
        </md-input-container>

        <md-input-container>
          <label>Date</label>
          <md-input type="date" v-model="structure.actionDate"></md-input>
        </md-input-container>

        <md-input-container>
          <label>Time</label>
          <md-input type="time" v-model="structure.actionTime"></md-input>
        </md-input-container>
        
        <div>
          <md-checkbox v-model="structure.actioned">Actioned?</md-checkbox>
        </div>

        <md-button @click="submit" type="submit" class="md-raised md-accent">Save</md-button>
      </form>
    </div>
  </div>
</template>

<script>
  import {find, findIndex} from 'lodash'

  import NoActiveStructure from '../../../components/no-active-structure.vue'
  import NoTasks from '../../../components/no-tasks.vue'

  export default {
    data() {
      return {
        structure: (() => {
          // Structure should be a copy of the activeStructure, so that updating only
          // takes place once 'submitted'
          return Object.assign({}, this.$store.getters.activeStructure)
        })(),
      }
    },
    components: {
      NoActiveStructure,
      NoTasks
    },
    mounted() {
    },
    methods: {
      submit(e) {
        this.$store.commit('updateIRSStructure', this.structure)
        history.back()
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