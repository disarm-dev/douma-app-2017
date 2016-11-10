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
  import { mapActions } from 'vuex'

  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  import geoCoords from 'geojson-coords'
  import MapHelpers from '../../../lib/map_helpers.js'

  import firebase from 'firebase'
  // TODO: Remove temp data
  import firebaseStructures from '../../../bootstrap/firebase_export.json' // Smaller 


  export default {
    data(){
      return {
        map: {},
        structures: {},
        fociGuessLayer: new Leaflet.FeatureGroup(),
        fociGuess: {}
      }
    },
    mounted() {
      this.map = Leaflet.map('identify-map', {
        tms: true
      });

      const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'
      Leaflet.tileLayer(url).addTo(this.map); 
      this.map.addLayer(this.fociGuessLayer)
    },
    methods: {
      loadStructures() {
        
        const structuresArray = Helpers.firebaseObjectToArray(firebaseStructures)

        // Create featureCollection from raw data
        const structuresFeatureCollection = MapHelpers.buildFeatureCollection(structuresArray)
        
        // Plot structures
        // this.structures = new MapSupport(structuresFeatureCollection)

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