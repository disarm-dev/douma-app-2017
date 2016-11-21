<template>
  <div id="irs-map"></div>
</template>


<script>
  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  import MapHelpers from '../../../lib/map_helpers.js'

  export default {
    data() {
      return {
        leMap: null,
        structuresLayer: null,
        structuresFeatureCollection: null,
      }
    },
    computed: {
      structures () { return this.$store.state.irs.structures }
    },
    mounted() {
      this.loadMap()
      this.loadStructures()
    },
    watch: {
      '$store.state.irs.activeStructure': 'redrawStructures',
    },
    methods: {
      loadMap(){
        // Configure basic map
        this.leMap = Leaflet.map('irs-map', {
          center: [-26.3231769,31.1380957],
          zoom: 15,
          tms: true
        });
        // Add basemap
        const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        // Leaflet.tileLayer(url).addTo(this.leMap);
      },
      loadStructures() {
        if (this.structuresLayer) {
          return
        }

        if (!this.$store.state.irs.structures) {
          return
        }

        this.structuresFeatureCollection = this.$store.state.irs.structures.featureCollection

        this.structuresLayer = Leaflet.geoJSON(this.structuresFeatureCollection, {
          style: (feature) => {
            return this.colourStructure(feature)
          },
          onEachFeature: (feature, layer) => {
            // Make sure each feature has its layerId set as a property. This way
            // the feature alone can be passed for editing, and have the specific
            // GeoJSON layer update when editing is finished.

            feature.properties.layerId = L.stamp(layer)

            layer.on('click', () => {
              this.$store.commit('irs:setActiveStructure', layer.feature.properties)
              this.$router.push({name: 'irs:form'})
            })

            layer.on('contextmenu', (e) => {
              this.$store.commit('irs:setActiveStructure', feature.properties)
              const changedStructured = Object.assign(feature.properties, {actioned: !feature.properties.actioned})
              this.$store.commit('irs:updateStructure', changedStructured)
            })

          }
        })

        this.structuresLayer.addTo(this.leMap)
        this.leMap.fitBounds(this.structuresLayer.getBounds())
      },
      redrawStructures() {
        console.log('redrawStructures')
        const layerId = this.$store.state.irs.activeStructure.layerId
        const layerToRedraw = this.structuresLayer.getLayer(layerId)
        this.structuresLayer.resetStyle(layerToRedraw)  
      },
      colourStructure(structureFeature){
        if (structureFeature.properties.actioned) {
          return {color: 'green'}
        } else {
          return {color: 'red'}
        }
      }
    }
  }
</script>

<style>
  #irs-map {
    z-index: 0;
    height: 80vh;
  }

</style>