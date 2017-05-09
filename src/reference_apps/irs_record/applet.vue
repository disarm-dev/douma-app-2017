<template>
  <router-view></router-view>
</template>

<script>
  export default {
    name: 'IrsRecordApplet',
    mounted() {
      // TODO: @refac Need to cancel or timeout the RemoteDB request for clusters when offline (otherwise searches forever)
      this.$store.dispatch("irs:get_clusters").then(() => {
        this.$store.dispatch('irs_record:load_saved_clusters')
      })
    }
  }
</script>

<style scoped>
  .container {
    margin: 10px;
  }
</style>