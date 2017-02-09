<template>
  <div class='container'>
    <h1>ClustersSearchView</h1>
    <h2>Search for new Clusters</h2>

    <multiselect v-model="search_definition" 
      :options="search_options" 
      :multiple="true" 
      group-values="locations" 
      group-label="location_type_label" 
      placeholder="Search for Clusters by location" 
      track-by="name" 
      label="name">
      <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
    </multiselect>

    <md-button :disabled='search_definition.length === 0' @click.native='search'>Search</md-button>
    <md-button :disabled='search_definition.length === 0' @click.native='clear'>Clear</md-button>
    <md-button :disabled='clusters_to_open.length === 0' @click.native='keep'>Keep these</md-button>


    <router-view :search_results='search_results'></router-view>

  </div>

</template>


<script>
  import Multiselect from 'vue-multiselect'

  export default {
    name: 'ClustersSearchView',
    components: {
      'multiselect': Multiselect
    },
    data() {
      return {
        search_definition: [],
        clusters_to_open: [],
        search_results: [],
        search_options: [
          { 
            location_type_label: 'Region',
            locations: [
              {name: 'Lubombo', location_type: 'region'}, 
              {name: 'Shiselweni', location_type: 'region'},
              {name: 'Manzini', location_type: 'region'},
              {name: 'Hhohho', location_type: 'region'}
            ]
          },{ 
            location_type_label: 'Locality',
            locations: [
              {name: 'Locality1', location_type: 'locality'},
              {name: 'Locality2', location_type: 'locality'}
            ]
          }
        ]
      }
    },
    methods: {
      search() {
        this.$store.dispatch("irs_record:search_clusters", this.search_definition)        
          .then(result => this.search_results = result)
      },
      clear() { 
        this.search_results = []
        this.search_definition = [] 
      },
      keep() {
        this.$store.dispatch("irs_record:open_clusters", this.clusters_to_open)
      }
    }
  }

</script>

