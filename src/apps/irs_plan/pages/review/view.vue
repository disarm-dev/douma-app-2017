<template>
  <div>
    <h1>ReviewView</h1>
    <div>This can contain some summary content of current status (and other buttons?)</div>
    <div>If there are Clusters, then show Map (with view switcher to List)</div>
    <md-button @click.native="$router.push({name: 'irs_plan:create'})">Redo clustering</md-button>
    <div>else</div>
    <md-button @click.native="$router.push({name: 'irs_plan:create'})">Start clustering</md-button>
    <div>both buttons go to 'OU selector page' (redo clustering issues a DELETE request first) </div>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'ReviewView',
    mounted() {
      if(this.$store.state.irs_plan.clusters.length === 0) {
        this.$store.dispatch("irs_plan:get_clusters")
      }
    }
  }
</script>