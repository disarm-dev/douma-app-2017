<template>
  <div class="tasks">
    <template v-if='tasksCount <= 0'>
      <div class='md-title'>Load IRS tasks</div>
      <p>Please select a Scale and then an Area of Interest: </p>

      <md-input-container>
        <label for="spatialScale">Spatial scale</label>
        <md-select name="spatialScale" v-model="spatialScale">
          <md-option value="Region">Region</md-option>
          <md-option value="Locality">Locality</md-option>
          <md-option value="Inkhundla">Inkhundla</md-option>
          <md-option value="Village">Village</md-option>
          <md-option value="Cluster">Cluster</md-option>
          <md-option value="Homestead">Homestead</md-option>
          <md-option value="Household">Household</md-option>
          <md-option value="Structure">Structure</md-option>
          <md-option value="Room">Room</md-option>
        </md-select>
      </md-input-container>
      <md-input-container>
        <label for="region">Region</label>
        <md-select name="region" v-model="region">
          <md-option value="hhohho">Hhohho</md-option>
          <md-option value="lubombo">Lubombo</md-option>
          <md-option value="manzini">Manzini</md-option>
          <md-option value="shiselweni">Shiselweni</md-option>
        </md-select>
      </md-input-container>

      <div>
        <md-button class='md-raised md-accent' @click='loadTasks'>Search for clusters</md-button>
      </div>
      
    </template>
    <irs-list v-else></irs-list>
  </div>
</template>

<script>
  import IrsList from '../list/list.vue'

  export default {
    name: 'IrsTasks',
    components: {'irs-list': IrsList},
    data() {
      return {
        spatialScale: '',
        region: '',
      }
    },
    computed: {
      tasksCount() {
        return this.$store.state.irs.tasks.length
      }
    },
    methods: {
      loadTasks() {
        // Get user input
        this.$store.commit('irs:setAoi', this.region)
        this.$store.dispatch('irs:buildTasks')
      }
    }
  }


</script>

<style scoped>
  .tasks {
    max-width: 800px;
    margin: 1em auto;
    padding: 1em;
  }
</style>
