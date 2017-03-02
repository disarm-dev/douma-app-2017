<template>
  <div>
    <div class='container'>
      <h1>Clustering review</h1>
      <p>This page shows there are {{$store.state.irs_tasker.clusters.length}} Clusters already created for demo instance <i>{{$store.state.meta.demo_instance_id}}</i>.</p><p>If you want to redo the clustering procedure, click the 'REDO' button below.</p>
      <div v-if="clusters_available == false">
        <p>There are no clusters, click below to create clusters</p>
        <md-button @click.native="do_clustering">Do clustering</md-button>
      </div>
      <md-button v-if="clusters_available == true" @click.native="redo_clustering">Redo clustering</md-button>
    </div>


    <router-view v-if='clusters_available'></router-view>
    
  </div>
</template>

<script>
  export default {
    name: 'ReviewView',
    computed: {
      clusters_available() {
        return this.$store.state.irs.clusters.length !== 0
      }
    },
    mounted() {
      this.$store.dispatch("irs:get_clusters")
    },
    methods: {
      redo_clustering() {
        this.$store.commit('root:set_loading',true)
        this.$store.dispatch('irs_plan:delete_clusters').then(() => {
          this.$store.state.irs_tasker.clusters = []
          this.$store.commit('root:set_loading',false)
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