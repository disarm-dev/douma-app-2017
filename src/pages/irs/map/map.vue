<template>
  <div id="irs-map"></div>
</template>


<script>
  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  import MapHelpers from '../../../lib/map_helpers.js'
  import {findIndex} from 'lodash'
  
  
  

  export default {
    data() {
      return {
        map: {},
        structuresLayer: null
      }
    },
    mounted() {
      console.log('mounted')
      this.map = Leaflet.map('irs-map', {
        center: [-26.3231769,31.1380957],
        zoom: 15,
        tms: true
      });
      const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'
      
      Leaflet.tileLayer(url).addTo(this.map);

      this.loadStructures()

      this.$store.subscribe((mutation, state) => {
        if (mutation.type == "actionStructure") {
          if (this.structuresLayer) {
            this.map.removeLayer(this.structuresLayer)
          }
          this.loadStructures();
        }
      })
    },
    methods: {
      loadStructures() {

        const structuresFeatureCollection = MapHelpers.buildFeatureCollection(this.$store.state.irs.structures)


        this.structuresLayer = Leaflet.geoJSON(structuresFeatureCollection, {
          style: (feature) => {
            // if(!feature.properties.actioned) debugger
            if (feature.properties.actioned) {
              return {color: 'green'}
            } else {
              return {color: 'red'}
            }
          },
          onEachFeature: (feature, layer) => {
            layer.on('click', () => {
              this.$store.commit('setActiveIRSStructure', feature.properties.id)
              this.$router.push({name: 'irs:form'})
            })

            layer.on('contextmenu', (e) => {
              console.log('context')
              e.target.setStyle({color: 'green'})
              this.$store.commit('actionStructure', feature.properties.id)
            })
          }
        })

        this.$nextTick( () => {
          this.structuresLayer.addTo(this.map)
          this.map.fitBounds(this.structuresLayer.getBounds())
        })
      },
    }
  }
</script>

<style>
  #irs-map {
    z-index: 0;
    height: 80vh;
  }

</style>