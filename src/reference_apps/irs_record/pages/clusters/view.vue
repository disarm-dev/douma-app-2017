<template>
  <div style='position: relative'>
    <div class='container'>
      <h1>Clusters Review</h1>
      <p>
        This page lets you see which Clusters have saved to work with offline.
        At the moment you have {{saved_clusters.length}} Clusters saved offline.
      </p>
      <p>Click on the Clusters in the map to start recording progress for each</p>
      <md-button @click.native='$router.push({name: "irs_record:clusters_search"})'>Search for Clusters to save offline</md-button>
      <md-button @click.native="toggle_view">{{toggle_to_view}}</md-button>

    </div>


    <router-view :clusters='saved_clusters'></router-view>

  </div>
</template>

<script>
  export default {
    name: 'ClustersView',
    data() {
      return {
        spray_team: {},
        spray_team_options: [
          { id: 'spray_team_1', name: 'Spray team 1'},
          { id: 'spray_team_2', name: 'Spray team 2'},
          { id: 'spray_team_3', name: 'Spray team 3'}
        ],
      }
    },
    computed: {
      saved_clusters() {
        return this.$store.state.irs.clusters.filter(cluster => {
          return this.$store.state.irs_record.saved_cluster_ids.includes(cluster._id)
        })
      },  
      toggle_to_view() {
        if (this.$route.meta && this.$route.meta.type === 'map') {
          return 'list'
        } else {
          return 'map'
        }
      },
      need_to_search() {
        return this.saved_clusters.length === 0
      }
    },
    methods: {
      navigate(route) {
        this.$router.push({name: `irs_record:clusters:${route}`})
      },
      toggle_view() {
        this.$router.push({name: `irs_record:clusters:${this.toggle_to_view}`})
      },
      show_all() {
        this.select_spray_team({})
      },
      select_spray_team(spray_team) {
        this.spray_team = spray_team
        // this.$store.dispatch("irs_record:set_clusters_from_local", spray_team.id)
      } 
    }
  }
</script>

<style scoped>
.container {
  margin: 10px;
}
</style>