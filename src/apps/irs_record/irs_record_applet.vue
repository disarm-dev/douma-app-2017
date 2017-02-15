<template>
  <router-view></router-view>
</template>

<script>
  export default {
    name: 'IrsRecordApplet',
    mounted() {
      this.$store.dispatch('irs_record:set_team_id', this.$store.state.user.team_id)
    }
  }
</script>

<style scoped>
  .container {
    margin: 10px;
  }
</style>