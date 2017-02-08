<template>
  <div class='container'>
    <h2>Search for new Clusters</h2>

    <multiselect v-model="search_definition" 
      :options="options" 
      :multiple="true" 
      group-values="locations" 
      group-label="location_type" 
      placeholder="Search for Clusters by location" 
      track-by="name" 
      label="name">
      <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
    </multiselect>

    <md-button @click='search'>Search</md-button>


  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect'

  export default {
    name: 'ClustersSearch',
    components: {
      'multiselect': Multiselect
    },
    data() {
      return {
        search_definition: [],
        options: [
          { 
            location_type: 'Region',
            locations: [
              {name: 'Lubombo', location_type: 'Region'}, {name: 'Shiselweni', location_type: 'Region'}
            ]
          },{ 
            location_type: 'Inkhundla',
            locations: [
              {name: 'Good one', location_type: 'Inkhundla'}, {name: 'Other one', location_type: 'Inkhundla'}
            ]
          },{ 
            location_type: 'Locality',
            locations: [
              {name: 'Some Bend', location_type: 'Locality'}, {name: 'Small Bend', location_type: 'Locality'}
            ]
          }
        ]
      }
    },
    methods: {
      search() {
        console.log('Go search for', this.search_definition)
      }
    }
  }

</script>

