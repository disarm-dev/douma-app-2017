<template>
  <div class='container'>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'IrsRecordApplet',
    mounted() {
      // Launch the IRS Progress app, by loading the local data
      this.$store.dispatch('irs_record:set_clusters_from_local')
    }
  }
</script>

<style scoped>
  .container {
    margin: 10px;
  }
</style>