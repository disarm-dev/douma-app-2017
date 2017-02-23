<template>
  <div>
    <h1>ReviewView</h1>
    <div v-if="loading">
      Getting clusters...
      <md-progress md-indeterminate></md-progress>
    </div>

    <div v-if="!loading">
      
      <div v-if="clustersAvailable == true">
        <md-button @click.native="redoClustering">Redo clustering</md-button>

        <div>
          <p>{{$store.state.irs_plan.clusters.length}} clusters</p>
          <p>Bunch of stats on clusters here</p>
          <router-view></router-view>
        </div>
      </div>


      <div v-if="clustersAvailable == false">
        <p>There are no clusters, click below to create clusters</p>
        <md-button @click.native="doClustering">Do clustering</md-button>
      </div>
    </div>
    
  </div>
</template>

<script>
  export default {
    name: 'ReviewView',
    data() {
      return {
        loading: false,
      }
    },
    computed: {
      clustersAvailable() {
        return this.$store.state.irs_plan.clusters.length !== 0
      }
    },
    mounted() {
      if(this.$store.state.irs_plan.clusters.length === 0) {
        this.loading = true
        this.$store.dispatch("irs_plan:get_clusters").then((clusters) => {
          this.loading = false
          if (this.clustersAvailable) {
            this.$router.push({name: 'irs_plan:review:map'})
          }
        })
      }
    },
    methods: {
      redoClustering() {
        this.$store.dispatch('irs_plan:delete_clusters').then(() => {
          this.$store.state.irs_plan.clusters = []
          this.$router.push({name: 'irs_plan:create:select_ous'})  
        })
      },
      doClustering() {
        this.$router.push({name: 'irs_plan:create:select_ous'})
        // send to clusters page
      }
    }
  }
</script>