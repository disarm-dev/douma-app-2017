<template>
  <div>
    <h1>ReviewView</h1>
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