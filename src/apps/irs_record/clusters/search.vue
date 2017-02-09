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

    <md-button :disabled='search_definition.length === 0' @click.native='search'>Search</md-button>
    <md-button :disabled='search_definition.length === 0' @click.native='clear'>Clear</md-button>

    <md-list>
      <md-list-item 
        v-for='(cluster, index) in $store.state.irs_record.clusters_search_results'>
        <input type="checkbox" :id="cluster._id" :value="cluster" v-model="keep_these_clusters">
        <label :for="cluster._id">{{cluster.name}} - {{cluster._id}}</label>
      </md-list-item>
    </md-list>

    <md-button :disabled='keep_these_clusters.length === 0' @click.native='keep'>Keep these</md-button>

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
        keep_these_clusters: [],
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
      },
      clear() { 
        this.$store.commit("irs_record:set_clusters_search_results", [])
        this.search_definition = [] 
      },
      keep() {
        this.$store.dispatch("irs_record:open_clusters", this.keep_these_clusters)
      }
    }
  }

</script>

