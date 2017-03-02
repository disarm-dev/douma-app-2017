<template>
  <router-view></router-view>
</template>

<script>
  export default {
    name: 'IrsRecordApplet',
    mounted() {
      this.$store.dispatch("irs_tasker:get_clusters", {demo_instance_id: this.$store.state.meta.demo_instance_id})
        .then(() => {
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