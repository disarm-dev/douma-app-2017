<template>
  <router-view></router-view>
</template>

<script>
  export default {
    name: 'IrsRecordApplet',
    mounted() {
      this.$store.dispatch('irs_record:configure_sync', this.$store.state.meta.demo_instance_id)
    }
  }
</script>

<style scoped>
  .container {
    margin: 10px;
  }
</style>