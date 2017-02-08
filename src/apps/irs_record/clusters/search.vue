<template>
  <div class='container'>
    <h2>Search for new Clusters</h2>

    <multiselect v-model="search_definition" 
      :options="options" 
      :multiple="true" 
      group-values="locations" 
      group-label="location_type_label" 
      placeholder="Search for Clusters by location" 
      track-by="name" 
      label="name">
      <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
    </multiselect>

    <md-button @click.native='search'>Search</md-button>
    <md-button @click.native='clear'>Clear</md-button>

    <ul>
      <li v-for='cluster in clusters_search_results'>{{cluster.name}}</li>
    </ul>

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
        clusters_search_results: [],
        options: [
          { 
            location_type_label: 'Region',
            locations: [
              {name: 'Lubombo', location_type: 'region'}, 
              {name: 'Shiselweni', location_type: 'region'},
              {name: 'Manzini', location_type: 'region'},
              {name: 'Hhohho', location_type: 'region'}
            ]
          },{ 
            location_type_label: 'Inkhundla',
            locations: [
              {name: 'Inkhundla1', location_type: 'inkhundla'},
              {name: 'Inkhundla2', location_type: 'inkhundla'},
              {name: 'Inkhundla3', location_type: 'inkhundla'},
              {name: 'Inkhundla4', location_type: 'inkhundla'},
              {name: 'Inkhundla5', location_type: 'inkhundla'}
            ]
          },{ 
            location_type_label: 'Locality',
            locations: [
              {name: 'Locality1', location_type: 'locality'},
              {name: 'Locality2', location_type: 'locality'},
              {name: 'Locality3', location_type: 'locality'},
              {name: 'Locality4', location_type: 'locality'},
              {name: 'Locality5', location_type: 'locality'}
            ]
          }
        ]
      }
    },
    methods: {
      search() {
        this.$store.dispatch("irs_record:search_remote_clusters", {locations: this.search_definition})
          .then((clusters_search_results) => {
            // console.log(clusters_search_results)
            this.clusters_search_results = clusters_search_results
          })

      },
      clear() { 
        // this.search
        this.clusters_search_results = [] 
      }
    }
  }

</script>

