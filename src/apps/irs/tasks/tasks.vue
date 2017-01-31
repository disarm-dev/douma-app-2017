<template>
  <div class="tasks">
    <template v-if='tasksCount <= 0'>
      <div class='md-title'>Load IRS tasks</div>
      <p>Please select a Scale and then an Area of Interest: </p>
      
      <multiselect v-model="searchDefinition" 
        :options="options" 
        :multiple="false" 
        group-values="locations" 
        group-label="locationType" 
        placeholder="Type to search a whole bunch of stuff" 
        track-by="name" 
        label="name">
        <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
      </multiselect>

      <div>
        <md-button class='md-raised md-accent' @click='loadTasks'>Search for clusters</md-button>
      </div>
      
    </template>
    <irs-list v-else></irs-list>
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect'
  import IrsList from '../list/list.vue'

  export default {
    name: 'IrsTasks',
    components: {
      'irs-list': IrsList,
      'multiselect': Multiselect
    },
    data() {
      return {
        searchDefinition: [],
        spatialScale: '',
        region: '',
        options: [
          { 
            locationType: 'Region',
            locations: [
              {name: 'Lubombo'}, {name: 'Shiselweni'}
            ]
          },{ 
            locationType: 'Inkhundla',
            locations: [
              {name: 'Good one'}, {name: 'Other one'}
            ]
          },{ 
            locationType: 'Locality',
            locations: [
              {name: 'Some Bend'}, {name: 'Small Bend'}
            ]
          }
        ]
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
