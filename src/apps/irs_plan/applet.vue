<template>
  <router-view></router-view>
</template>

<script>
  export default {
    name: 'IRSPlanApplet',
    mounted() {
      this.$store.dispatch('irs_monitor:set_team_id', )
    }
  }
</script>

<style scoped>
  .container {
    margin: 10px;
  }
</style>