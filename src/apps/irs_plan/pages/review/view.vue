<template>
  <div>
    <div class='container'>
      <h1>Clustering review</h1>
      <p>This page shows there are {{clusters_count}} Clusters already created for demo instance <i>{{demo_instance_id}}</i>.</p><p>If you want to redo the clustering procedure, click the 'REDO' button below.</p>
      <div v-if="!clusters_available">
        <p>There are no clusters, click below to create clusters</p>
        <md-button @click.native="do_clustering">Do clustering</md-button>
      </div>
      <md-button v-if="clusters_available" @click.native="redo_clustering">Redo clustering</md-button>

      <md-button v-if="clusters_available" :href='download_url' v-bind:download='download_filename' class="md-raised md-primary">Download shapefile</md-button>
    </div>

    <router-view v-if='clusters_available'></router-view>
    
  </div>
</template>

<script>
  export default {
    name: 'ReviewView',
    mounted() {
      this.$store.dispatch("irs:get_clusters")
    },
    computed: {
      clusters_available() {
        return this.$store.state.irs.clusters.length > 0
      },
      clusters_count() {
        return this.$store.state.irs.clusters.length
      },
      demo_instance_id() {
        return this.$store.state.meta.demo_instance_id
      },
      download_url() {
        if (!this.clusters_available) return
        // TODO: @refac Move download URL creation to Sync or somewhere else that is not a view
        const cluster_collection_id = this.$store.state.irs.clusters[0].properties.cluster_collection_id
        return DOUMA_API_URL + '/clusters/shapefile?cluster_collection_id=' + cluster_collection_id
      },
      download_filename() {
        if (!this.clusters_available) return
        // TODO: @refac Move download filename creation to Sync or somewhere else that is not a view
        const cluster_collection_id = this.$store.state.irs.clusters[0].properties.cluster_collection_id
        return `clusters-${cluster_collection_id}.zip`
      }
    },
    methods: {
      redo_clustering() {
        this.$store.dispatch('irs:redo_clusters').then(() => {
          this.$router.push({name: 'irs_plan:create:select_ous'})
        })
       
      },
      do_clustering() {
        this.$router.push({name: 'irs_plan:create:select_ous'})
      }
    }
  }
</script>

<style scoped>
  .container { margin: 10px; }
</style>