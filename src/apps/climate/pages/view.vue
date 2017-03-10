<template>
  <div>
    Weather data for Zimbabwe
    <climate-map></climate-map>
  </div>
</template>

<script>
  import ClimateMap from './map.vue'

  export default {
    name: 'ClimateView',
    components: {ClimateMap},
    data () {
      return {
      }
    }
  }
</script>

<style scoped>
</style>