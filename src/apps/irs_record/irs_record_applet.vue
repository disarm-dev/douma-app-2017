<template>
  <router-view></router-view>
</template>

<script>
  export default {
    name: 'IrsRecordApplet',
    mounted() {
      // TODO: @fix Remove this duplicate setting of team_id?
      this.$store.dispatch('irs_record:set_team_id', this.$store.state.meta.team_id)
    }
  }
</script>

<style scoped>
  .container {
    margin: 10px;
  }
</style>