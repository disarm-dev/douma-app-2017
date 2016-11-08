<template>
  <div>
    <md-button @click="loadStructures">Load data</md-button>
    <md-button @click="guessFoci">Guess foci</md-button>
    <md-button @click="editFoci">Edit foci</md-button>
    <div id="identify-map"></div>
  </div>
</template>

<script>
  import * as Helpers from '../../../lib/helpers.js'

  import Leaflet from 'leaflet'
  import firebase from 'firebase'
  import 'leaflet/dist/leaflet.css'
  import { mapActions } from 'vuex'
  import geoCoords from 'geojson-coords'

  import {MapSupport} from './map_support.js'
  // TODO: Remove temp data
  import firebaseStructures from './temp_structures.js'


  export default {
    data(){
      return {
        map: {},
        structures: {},
        fociGuessLayer: new Leaflet.FeatureGroup(),
        fociGuess: {}
      }
    },
    methods: {
      loadStructures() {
        const structuresArray = Helpers.objectToArray(firebaseStructures)

        // Create featureCollection from raw data
        const structuresFeatureCollection = Helpers.buildFeatureCollection(structuresArray)
        
        // Plot structures
        this.structures = new MapSupport(structuresFeatureCollection)

        const structureStyle = {
          weight: 1,
          color: 'green'
        }

        const structuresLayer = Leaflet.geoJSON(this.structures.polygons, {style: (feature) => {
          if (feature.properties.casePresent === true) {
            return {color: 'red'}
          } else {
            return {color: 'blue'}
          }
        }})
        
        
        structuresLayer.addTo(this.map)
        this.map.fitBounds(structuresLayer.getBounds())
      },
      guessFoci() {
        // result is in a FeatureCollection
        this.fociGuess = this.structures.guessFociBoundary()

        const coordinates = geoCoords(this.fociGuess);
        // convert geoJson coordinates into Leaflet coordinates
        const polyCoordinates = Leaflet.GeoJSON.coordsToLatLngs([coordinates], 1)
        
        this.fociGuessLayer.addLayer(Leaflet.polygon(polyCoordinates))      
      },
      editFoci() {
        const drawControl = new Leaflet.Control.Draw({
          draw: {
            polygon: true,
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
      }
    },
    mounted() {
      this.map = Leaflet.map('identify-map', {
        tms: true
      });

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