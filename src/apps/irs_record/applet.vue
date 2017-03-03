<template>
  <router-view></router-view>
</template>

<script>
  export default {
    name: 'IrsRecordApplet',
    mounted() {
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