<template>
  <div>
    
    <no-active-structure v-if="!$store.state.irs.activeStructure" />

    <div v-else class="form">
      <div class="md-title">Structure: {{structureCopy.id}}</div>

      <form novalidate @submit.stop.prevent="submit">

        <md-input-container>
          <label>Actioned by</label>
          <md-input v-model="structureCopy.actionBy"></md-input>
        </md-input-container>

        <md-input-container>
          <label>Date</label>
          <md-input type="date" v-model="structureCopy.actionDate"></md-input>
        </md-input-container>

        <md-input-container>
          <label>Time</label>
          <md-input type="time" v-model="structureCopy.actionTime"></md-input>
        </md-input-container>
        
        <div>
          <md-checkbox v-model="structureCopy.actioned">Actioned?</md-checkbox>
        </div>

        <md-button @click="submit" type="submit" class="md-raised md-accent">Save</md-button>
      </form>
    </div>
  </div>
</template>

<script>
  import NoActiveStructure from '../../../components/no-active-structure.vue'
  import NoTasks from '../../../components/no-tasks.vue'

  export default {
    data() {
      return {
        // Structure should be a copy of the activeStructure, so that updating only
        // takes place once 'submitted'
        structureCopy: Object.assign({}, this.$store.state.irs.activeStructure)
      }
    },
    components: {
      NoActiveStructure,
      NoTasks
    },
    methods: {
      submit(e) {
        this.$store.commit('irs:updateStructure', this.structureCopy)
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