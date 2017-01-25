<template>
  <div id="gps-example"></div>
</template>
<script>
  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'

  import LeafletGPS from './gps'

  export default {
    data() {
      return {
        lmap: null,
        gps: null
      }
    },
    mounted() {
      this.lmap = Leaflet.map('gps-example', {tms: true})

      const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'
      
      Leaflet.tileLayer(url).addTo(this.lmap)

      this.gps = new LeafletGPS(this.lmap)
    },
    beforeDestroy() {
      this.gps.destroy()
    }
  }
</script>
<style>
  #gps-example {
    z-index: 0;
    min-height: 85vh;
    overflow: hidden;
  }
</style>