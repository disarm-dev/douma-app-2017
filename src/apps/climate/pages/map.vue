<template>
  <div id="map"></div>
</template>

<script>
  
  export default {
    name: 'ClimateMap',
    data () {
      return {
        map: {},
      }
    },
    mounted() {
      this.create_map()
    },
    methods: {
      create_map() {
        mapboxgl.accessToken = 'pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'
        this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox:// styles/mapbox/streets-v9',
            center: [31.50484892885717, -26.543508675283874],
            zoom: 7.34
        })
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