<template>
  <div class='fab-container'>
    <md-button class="md-fab md-accent" v-show='!fociGuess' @click="guessFoci()">
      <md-icon style="color: white">border_outer</md-icon>
    </md-button>
    <md-button class="md-fab md-primary" v-show='fociGuess'>
      <md-icon style="color: white">save</md-icon>
    </md-button>
    <div id="identify-map"></div>
  </div>
</template>

<script>
  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  
  import 'leaflet-draw'
  import 'leaflet-draw/dist/leaflet.draw.css'

  import geoCoords from 'geojson-coords'
  import MapHelpers from '../../../lib/map_helpers.js'

  export default {
    data() {
      return {
        map: {},
        structuresLayer: null,
        fociGuessLayer: new Leaflet.FeatureGroup(),
        fociGuess: null
      }
    },
    mounted() {
      this.map = Leaflet.map('identify-map', {
        tms: true
      });

      const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'
      Leaflet.tileLayer(url).addTo(this.map)
      this.map.addLayer(this.fociGuessLayer)
      this.addEditFociControls()
      this.loadStructures()
    },
    methods: {
      loadStructures() {
        
        this.structuresLayer = Leaflet.geoJSON(this.$store.state.foci.structures.featureCollection, {style: (feature) => {
          if (feature.properties.casePresent === true) {
            return {color: 'red'}
          } else {
            return {color: 'blue'}
          }
        }})

        this.$nextTick(() => {
          this.structuresLayer.addTo(this.map)
          this.map.fitBounds(this.structuresLayer.getBounds())
        })
      },
      guessFoci() {
        // result is in a FeatureCollection
        this.fociGuess = MapHelpers.guessFociBoundary(this.$store.state.foci.structures.featureCollection)

        const coordinates = geoCoords(this.fociGuess);
        // convert geoJson coordinates into Leaflet coordinates
        const polyCoordinates = Leaflet.GeoJSON.coordsToLatLngs([coordinates], 1)
        
        this.fociGuessLayer.addLayer(Leaflet.polygon(polyCoordinates, {
          color: 'orange',
          dashArray: [5,5]
        }))      
      },
      addEditFociControls() {
        const drawControl = new Leaflet.Control.Draw({
          draw: {
            polygon: false,
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
  .fab-container {
    position: relative;
  }

  .fab-container .md-fab {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
  }

  #identify-map {
    z-index: 0;
    min-height: 85vh;
    overflow: hidden;
  }

</style>