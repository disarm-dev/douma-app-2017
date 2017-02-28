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

  export default {
    name: 'ClustersSearchView',
    data() {
      return {
        search_definition: [],
        clusters_to_open: [],
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
      }
    }
  }

</script>

<style scoped>
</style>

