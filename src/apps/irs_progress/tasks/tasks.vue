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
        <md-button @click='loadTasks' class='md-raised md-accent'>Search for clusters</md-button>
      </div>
      
    </template>
    <irs-progress-list v-else></irs-progress-list>
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect'
  import IrsProgressList from '../list/list.vue'

  export default {
    name: 'IrsTasks',
    components: {
      'irs-progress-list': IrsProgressList,
      'multiselect': Multiselect
    },
    data() {
      return {
        searchDefinition: [],
        spatialScale: '',
        region: 'lubombo',
        options: [
          { 
            locationType: 'Region',
            locations: [
              {name: 'Lubombo', locationType: 'Region'}, {name: 'Shiselweni', locationType: 'Region'}
            ]
          },{ 
            locationType: 'Inkhundla',
            locations: [
              {name: 'Good one', locationType: 'Inkhundla'}, {name: 'Other one', locationType: 'Inkhundla'}
            ]
          },{ 
            locationType: 'Locality',
            locations: [
              {name: 'Some Bend', locationType: 'Locality'}, {name: 'Small Bend', locationType: 'Locality'}
            ]
          }
        ]
      }
    },
    computed: {
      tasksCount() {
        return this.$store.state.irs_progress.tasks.length
      }
    },
    methods: {
      loadTasks() {
        this.$store.commit('irs_progress:setAoi', this.region)
        this.$store.dispatch('irs_progress:buildTasks')
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
