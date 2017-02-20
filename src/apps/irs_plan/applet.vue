<template>
  <iframe id="i" src="http://10.0.0.107:7676" frameborder="0"></iframe>
  <!-- <router-view></router-view> -->
</template>

<script>
  export default {
    name: 'IRSPlanApplet',
    mounted() {
      this.$store.dispatch('irs_plan:set_demo_instance_id', this.$store.state.meta.demo_instance_id)
    }
  }
</script>

<style scoped>
  #i {
    height: calc(100vh - 64px);
    width: 100%;
  }
  .container {
    margin: 10px;
  }
</style>