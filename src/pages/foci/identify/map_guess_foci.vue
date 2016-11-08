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

  import {MapSupport} from './map_support.js'
  // TODO: Remove temp data
  import firebaseStructures from './temp_structures.js'


  export default {
    data(){
      return {
        map: {},
        structures: {},
        fociGuessLayer: new L.FeatureGroup(),
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
        this.map.addLayer(this.fociGuessLayer)

        // result is in  geoJSON
        this.fociGuess = this.structures.guessFociBoundary()
        var coords = []

        Leaflet.geoJSON(this.fociGuess,  {
          onEachFeature(feature, layer) {
            const coordinates = feature.geometry.coordinates[0];
            coords = coordinates.map((array)=> {
              return [array[1], array[0]]
            })
          }
        })

        const poly = new Leaflet.polygon(coords)
        this.fociGuessLayer.addLayer(poly)

        // this works, but no editing
        //Leaflet.geoJSON(this.fociGuess).addTo(this.fociGuessLayer)
        
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

      const url = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      Leaflet.tileLayer(url).addTo(this.map);
      
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