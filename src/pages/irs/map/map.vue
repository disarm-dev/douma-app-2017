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
      }
    },
    created() {

    },
    mounted() {
      this.loadMap()

      this.$store.subscribe((mutation, state) => {
        debugger
        if (mutation.type == "updateIRSStructure") {
          this.redrawStructure(mutation.payload)
        }
      })
    },
    activated() {
      this.loadStructures()
    },
    methods: {
      loadMap(){
        this.leMap = Leaflet.map('irs-map', {
          center: [-26.3231769,31.1380957],
          zoom: 15,
          tms: true
        });
        const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        this.leMap.on('layerremove', () => console.log('layerremove'))
        
        // Leaflet.tileLayer(url).addTo(this.leMap);
      },
      loadStructures() {
        if (this.structuresLayer) {
          return
        }

        if (this.$store.state.irs.structures.length === 0) {
          return
        }

        // const structuresFeatureCollection = MapHelpers.buildFeatureCollection(this.$store.state.irs.structures)
        const structuresFeatureCollection = this.$store.state.irs.structures

        this.structuresLayer = Leaflet.geoJSON(structuresFeatureCollection, {
          style: (feature) => {
            // if(!feature.properties.actioned) debugger
            return this.colourStructure(feature)
          },
          onEachFeature: (feature, layer) => {
            layer.on('click', () => {
              this.$store.commit('setActiveIRSStructure', layer)
              console.log(layer)
              this.$router.push({name: 'irs:form'})
            })

            layer.on('contextmenu', (e) => {
              // e.target.setStyle({color: 'green'})
              // console.log(feature.properties)
              this.$store.commit('actionStructure', feature.properties.id)
            })
          }
        })

        this.structuresLayer.addTo(this.leMap)
        this.leMap.fitBounds(this.structuresLayer.getBounds())
      },
      redrawStructure() {
        // debugger
        console.log('redrawStructure')
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