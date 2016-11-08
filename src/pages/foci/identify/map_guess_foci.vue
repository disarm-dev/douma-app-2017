<template>
  <div>
    <button @click="loadStructures">Load data</button>
    <button @click="guessFoci">Guess foci</button>
    <button @click="editFoci">Edit foci</button>
    <div id="identify-map"></div>
  </div>
</template>

<script>
  import * as Helpers from '../../../lib/helpers.js'

  import Leaflet from 'leaflet'
  import firebase from 'firebase'
  import 'leaflet/dist/leaflet.css'
  import { mapActions } from 'vuex'

  import {MapSupport} from './map_support.js'
  // TODO: Remove temp data
  import firebaseStructures from './temp_structures.js'


  export default {
    data(){
      return {
        map: {},
        structures: {},
        fociGuessLayer: {},
        fociGuess: {}
      }
    },
    methods: {
      loadStructures() {
        const structuresArray = Helpers.objectToArray(firebaseStructures)

        // Create featureCollection from raw data
        const structuresFeatureCollection = Helpers.buildFeatureCollection(structuresArray)
        
        this.structures = new MapSupport(structuresFeatureCollection)

        // Plot structures
        Leaflet.geoJSON(this.structures.polygons).addTo(this.map)
      },
      guessFoci() {
        this.fociGuess = this.structures.guessFociBoundary()
        // Plot foci boundary
        const poly = new Leaflet.polygon(this.fociGuess)
        this.fociGuessLayer.addLayer(poly)
        this.fociGuessLayer.bringToFront()
        // Leaflet.geoJSON(this.fociGuess).addTo(this.map)
      },
      editFoci() {
        
        
      }
    },
    mounted() {
      this.map = Leaflet.map('identify-map', {
        center: [-26.1447782, 32.0813722],
        zoom: 15,
        tms: true
      });
      
      
      this.fociGuessLayer = new Leaflet.FeatureGroup();

      const drawControl = new Leaflet.Control.Draw({
        draw: {
          polygon: {
            allowIntersection: false,
          },
          marker: false,
          polyline: false,
          rectangle: false,
          circle: false
        },
        edit: {
          featureGroup: this.fociGuessLayer
        }
      });
      this.map.addControl(drawControl);

      const url = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      Leaflet.tileLayer(url).addTo(this.map);


      this.map.addLayer(this.fociGuessLayer)
      
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