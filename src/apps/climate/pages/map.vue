<template>
  <div id="map"></div>
</template>

<script>
  
  export default {
    name: 'ClimateMap',
    data () {
      return {
      }
    },
    mounted() {
      this.create_map()
    },
    methods: {
      create_map() {
      }
    }
  }
</script>

<style scoped>
  #map {
    min-height: calc(100vh - 270px);
    z-index: 0;
  }
</style>