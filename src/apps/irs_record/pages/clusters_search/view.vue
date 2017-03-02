<template>
  <div>
<div class='container'>    <h1>Select Clusters for offline</h1>
    <p>Click on the Clusters in the map below to choose some to save for offline use.</p>
    <p>You can also click the 'LIST' button see them as a list.</p>
    <md-button class='md-accent md-raised' :disabled='clusters_to_open.length === 0' @click.native='open_clusters'>Save these {{clusters_to_open.length}} offline</md-button>
    <md-button @click.native="toggle_view">{{toggle_to_view}}</md-button>
</div>
    <router-view :clusters='clusters_not_already_saved'></router-view>

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
    computed: {
      clusters_not_already_saved() {
        return this.$store.state.irs_tasker.clusters.filter(cluster => {
          return !this.$store.state.irs_record.saved_cluster_ids.includes(cluster._id)
        })        
      },
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
.container { margin: 10px; }
</style>

