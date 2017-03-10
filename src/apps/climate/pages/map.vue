<template>
  <div id="map"></div>
</template>

<script>
  import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
  import 'mapbox-gl/dist/mapbox-gl.css'

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
            center: [29.555289514559178, -19.273592175411892],
            zoom: 5
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