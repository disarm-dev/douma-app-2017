<template>
  <div id="map"></div>  
</template>

<script>
  import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
  import 'mapbox-gl/dist/mapbox-gl.css'

  export default {
    name: 'AreasMap',
    props: ['result_areas'],
    mounted() {
      create_map()
    },
    watch: {'formal_areas': 'redraw'},
    data() {
      return {
      }
    },
    computed: {

    },
    methods: {
      create_map(){
        mapboxgl.accessToken = 'pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        return new mapboxgl.Map({
          container: 'map',
          style: 'mapbox:// styles/mapbox/streets-v9',
          center: [31.50484892885717, -26.543508675283874],
          zoom: 7.34
        })
      },
      redraw() {
        console.log('redraw')
      }
    }
  }
</script>

<style scoped>
  #map {
    min-height: calc(100vh - 300px);
    z-index: 0;
  }
</style>