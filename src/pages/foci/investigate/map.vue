<template>
  <div class='fab-container'>
    <md-button class="md-fab md-clean" @click="$router.push({name: 'foci:investigate:detail'})">
      <md-icon>info_outline</md-icon>
    </md-button>
    <div id="investigate-map"></div>
  </div>
</template>

<script>
  import * as Helpers from '../../../lib/helpers.js'
  import MapHelpers from '../../../lib/map_helpers.js'
  import { mapActions } from 'vuex'

  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  import geoCoords from 'geojson-coords'

  export default {
    data() {
      return {
        map: {},
        activeFoci: this.$store.state.activeFoci
      }
    },
    mounted() {
      this.map = Leaflet.map('investigate-map', {
        tms: true,
        center: [-26.3231769,31.1380957],
        zoom: 10,
      });

      this.$parent.$on('show', () => {
        this.map.invalidateSize()
        this.map.fitBounds(this.focisLayer.getBounds())
      })

      const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'
      Leaflet.tileLayer(url).addTo(this.map); 
      // this.loadStructures()
      // this.loadFocis()
    },   
  }
</script>

<style scoped>
  .fab-container {
    position: relative;
  }

  .fab-container .md-fab {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
  }

  #investigate-map {
    z-index: 0;
    min-height: 85vh;
    overflow: hidden;
  }

</style>