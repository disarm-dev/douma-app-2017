<template>
  <div>
    <md-button @click="loadStructures">Load data</md-button>
    <md-button class="md-raised md-accent" @click="$router.push({name: 'monitor:list'})">List</md-button>
    <div id="monitor-map"></div>
  </div>
</template>

<script>
  import * as Helpers from '../../../lib/helpers.js'
  import MapHelpers from '../../../lib/map_helpers.js'
  import { mapActions } from 'vuex'

  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  import geoCoords from 'geojson-coords'

  // import firebaseStructures from './firebase_export.json'
  import firebaseStructures from './temp_structures.json' // Smaller 
  
  // import fociExamples from './foci.json'


  export default {
    data() {
      return {
        map: {},
        structuresLayer: {},
        focisFc: this.$store.state.focis
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
      this.loadFocis()
    },
    methods: {
      loadFocis() {
          Leaflet.geoJSON(this.focisFc, {
          onEachFeature: (feature, layer) => {
            layer.on({
              click: (e) => {
                // e.target.setStyle({color: 'pink'}) // TODO: Be serious
                layer.setStyle({color: 'pink'})
                feature.properties.casePresent = !(feature.properties.casePresent)
                // window.layer = layer
              }
            })
          }
        }).addTo(this.map)
      },
      loadStructures() {
        // Take Firebase object of structure polygons, return array with 
        // `id` as one of the properties
        const structuresArray = Helpers.firebaseObjectToArray(firebaseStructures)

        // Create FeatureCollection from the structuresArray
        const structuresFc = MapHelpers.buildFeatureCollection(structuresArray)
        
        // Create FeatureCollection of structure centroids
        // const centroidsFc = MapHelpers.convertPolygonsToCentroids(structuresFc)

        const structureStyle = {
          weight: 1,
          color: 'green'
        }

        const structuresLayer = Leaflet.geoJSON(structuresFc, {
            style: (feature) => {
              if (feature.properties.casePresent === true) {
                return {...structureStyle, color: 'red'}
              } else {
                return {...structureStyle, color: 'blue'}
              }
            },
            onEachFeature: (feature, layer) => {
              layer.on({
                click: (e) => {
                  e.target.setStyle({color: 'orange'}) // TODO: Be serious
                  feature.properties.casePresent = !(feature.properties.casePresent)
                }
              })
            }
          }
        )

        this.structuresLayer = structuresLayer
        
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