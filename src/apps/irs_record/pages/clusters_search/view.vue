<template>
  <div>
    <h1>ClustersSearchView</h1>
    <md-button :disabled='clusters_to_open.length === 0' @click.native='open_clusters'>Save these {{clusters_to_open.length}} offline</md-button>
    <md-button @click.native="toggle_view">{{toggle_to_view}}</md-button>
    <md-progress :md-indeterminate='$store.state.irs_record.sync_in_progress'></md-progress>


    <router-view></router-view>

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
    mounted() {
      this.$store.dispatch('irs_record:configure_sync', this.$store.state.meta.demo_instance_id)
      .then(() => this.search())

    },
    computed: {
      toggle_to_view() {
        if (this.$route.meta && this.$route.meta.type === 'map') {
          return 'list'
        } else {
          return 'map'
        }
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
      open_clusters() {
        this.$store.dispatch("irs_record:open_clusters", this.clusters_to_open)
          .then(() => this.$router.push({name: 'irs_record:clusters'}))
      },
      toggle_view() {
        this.$router.push({name: `irs_record:clusters_search:${this.toggle_to_view}`})
      },
      on_input(search_query, id) {
        if (this.search_definition.length) {
          this.search_results = []
        }

      }
    }
  }

</script>

<style scoped>
</style>

