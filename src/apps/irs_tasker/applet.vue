<template>
  <router-view></router-view>
</template>

<script>
  export default {
    name: 'IrsTaskerApplet',
    mounted() {
      this.$store.dispatch('irs_tasker:configure_sync', this.$store.state.meta.team_id)
    }
  }
</script>

<style scoped>
  .container {
    margin: 10px;
  }
</style>