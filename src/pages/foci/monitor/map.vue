<template>
  <div>
    <md-button @click="loadStructures">Load data</md-button>
    <div id="monitor-map"></div>
  </div>
</template>

<script>
  import * as Helpers from '../../../lib/helpers.js'
  import { mapActions } from 'vuex'

  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  import geoCoords from 'geojson-coords'
  import {MapSupport} from '../../../lib/map_support.js'

  // import firebaseStructures from './firebase_export.json'
  import firebaseStructures from './temp_structures.json' // Smaller 


  export default {
    data() {
      return {
        map: {},
        structuresFc: {},
        focisFc: {}
      }
    },
    mounted() {
      this.map = Leaflet.map('monitor-map', {
        tms: true,
        center: [-26.3231769,31.1380957],
        zoom: 10,
      });

      const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'
      Leaflet.tileLayer(url).addTo(this.map); 
      this.loadStructures()
    },
    methods: {
      loadFocis() {
        this.focisFc = {}

        const focisLayer = Leaflet.geoJSON(this.focisFc.polygons)
      },
      loadStructures() {
        const structuresArray = Helpers.firebaseObjectToArray(firebaseStructures)

        // Create featureCollection from raw data
        const structuresFeatureCollection = Helpers.buildFeatureCollection(structuresArray)
        
        // Plot structures
        this.structuresFc = new MapSupport(structuresFeatureCollection)

        const structureStyle = {
          weight: 1,
          color: 'green'
        }

        const structuresLayer = Leaflet.geoJSON(this.structuresFc.polygons, {
            style: (feature) => {
              if (feature.properties.casePresent === true) {
                return {color: 'red'}
              } else {
                return {color: 'blue'}
              }
            },
            // onEachFeature: (feature, layer) => {
            //   layer.on({
            //     click: (e) => {
            //     }
            //   })
            // }
          }
        )
        
        structuresLayer.addTo(this.map)
        this.map.fitBounds(structuresLayer.getBounds())

      }
    }
  }
</script>

<style scoped>
  #monitor-map {
    z-index: 0;
    height: 85vh;
    overflow: hidden;
  }
</style>