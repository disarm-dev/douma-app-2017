<template>
  <div>
    <h1>ReviewView</h1>
      
    <div v-if="clusters_available == true">
      <md-button @click.native="redo_clustering">Redo clustering</md-button>

      <div>
        <p>{{$store.state.irs_plan.clusters.length}} clusters</p>
        <p>Bunch of stats on clusters here</p>
        <router-view></router-view>
      </div>
    </div>

    <div v-if="clusters_available == false">
      <p>There are no clusters, click below to create clusters</p>
      <md-button @click.native="do_clustering">Do clustering</md-button>
    </div>
    
  </div>
</template>

<script>
  export default {
    name: 'ReviewView',
    computed: {
      clusters_available() {
        return this.$store.state.irs_plan.clusters.length !== 0
      }
    },
    mounted() {

      // this.$store.dispatch("irs_tasker:get_clusters", {demo_instance_id: this.$store.state.meta.demo_instance_id})


      if(this.$store.state.irs_plan.clusters.length === 0) {
        this.loading = true
        this.$store.dispatch("irs_plan:get_clusters").then((clusters) => {
          this.loading = false
          if (this.clusters_available) {
            this.$router.push({name: 'irs_plan:review:map'})
          }
        })
      }
    },
    methods: {
      redo_clustering() {
        this.$store.dispatch('irs_plan:delete_clusters').then(() => {
          this.$store.state.irs_plan.clusters = []
          this.$router.push({name: 'irs_plan:create:select_ous'})  
        })
      },
      do_clustering() {
        this.$router.push({name: 'irs_plan:create:select_ous'})
        // send to clusters page
      }
    }
  }
</script>