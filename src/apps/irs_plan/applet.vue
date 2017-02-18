<template>
  <router-view></router-view>
</template>

<script>
  export default {
    name: 'IRSPlanApplet',
    mounted() {
      this.$store.dispatch('irs_monitor:set_team_id', )
      this.$store.dispatch('irs_monitor:get_clusters')
      this.$store.dispatch('irs_monitor:get_tasks')
    }
  }
</script>

<style scoped>
  .container {
    margin: 10px;
  }
</style>