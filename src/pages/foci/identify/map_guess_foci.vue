<template>
  <div id="identify-map"></div>
</template>

<script>
  import * as Helpers from '../../../lib/helpers.js'

  import Leaflet from 'leaflet'
  import firebase from 'firebase'
  import 'leaflet/dist/leaflet.css'

  import {MapSupport} from './map_support.js'
  // TODO: Remove temp data
  import firebaseStructures from './temp_structures.js'


  export default {
    data(){
      return {
        map: {},
      }
    },
    mounted() {
      this.map = Leaflet.map('identify-map', {
        center: [-26.1447782, 32.0813722],
        zoom: 15,
        tms: true
      });
      const url = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      
      Leaflet.tileLayer(url).addTo(this.map);

      // Load structures
      const structuresArray = Helpers.objectToArray(firebaseStructures)
      const structuresFeatureCollection = Helpers.buildFeatureCollection(structuresArray)

      // Create featureCollection from raw data
      const structures = new MapSupport(structuresFeatureCollection)

      // Plot structures
      Leaflet.geoJSON(structures.polygons).addTo(this.map)
      
      // Guess foci
      const fociGuess = structures.guessFociBoundary()

      // Plot foci boundary
      const guessStyle     = {
        color: "#ff7800",
        fillOpacity: 0.2,
        weight: 2,
        opacity: 0.65,
        dashArray: "5,5"
      }

      Leaflet.geoJSON(fociGuess, {style: guessStyle}).addTo(this.map)
      
      // // Ask user to confirm foci guess
      
    }
  }
</script>

<style scoped>
  #identify-map {
    z-index: 0;
    height: 85vh;
    overflow: hidden;
  }

</style>