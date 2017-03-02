<template>
  <router-view></router-view>
</template>

<script>
  export default {
    name: 'IRSPlanApplet',
    mounted() {
      this.$store.dispatch('irs_plan:set_demo_instance_id')
    }
  }
</script>

<style scoped>
  .container {
    margin: 10px;
  }
</style>