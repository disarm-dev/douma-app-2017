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
        map: null,
        structuresLayer: null
      }
    },
    mounted() {
      this.loadMap()

      if (this.$store.state.irs.structures.length !== 0) {
        this.loadStructures()
      } else {
        console.warn('No structures loaded - try the Tasks pane')
      }

      this.$store.subscribe((mutation, state) => {
        if (mutation.type == "actionStructure") {
          this.redrawStructure(mutation.payload)
        }
      })


    },
    // watch: {
    //   '$route': 'redrawMap'
    // },
    methods: {
      // redrawMap(){
      //   if(this.$route.name === 'irs:map' && this.map) {
      //     this.loadStructures()
      //   }
      // },
      loadMap(){
        this.map = Leaflet.map('irs-map', {
          center: [-26.3231769,31.1380957],
          zoom: 15,
          tms: true
        });
        const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'
        
        // Leaflet.tileLayer(url).addTo(this.map);
      },
      loadStructures() {
        if (this.structuresLayer) {
          this.map.removeLayer(this.structuresLayer)
        }

        const structuresFeatureCollection = MapHelpers.buildFeatureCollection(this.$store.state.irs.structures)


        this.structuresLayer = Leaflet.geoJSON(structuresFeatureCollection, {
          style: (feature) => {
            // if(!feature.properties.actioned) debugger
            this.colourStructure(feature)
          },
          onEachFeature: (feature, layer) => {
            layer.on('click', () => {
              console.log(feature.properties.id)
              this.$store.commit('setActiveIRSStructure', feature.properties.id)
              this.$router.push({name: 'irs:form'})
            })

            layer.on('contextmenu', (e) => {
              // e.target.setStyle({color: 'green'})
              // console.log(feature.properties)
              this.$store.commit('actionStructure', feature.properties.id)
            })
          }
        })

        // this.$nextTick( () => {
          this.structuresLayer.addTo(this.map)
          this.map.fitBounds(this.structuresLayer.getBounds())
        // })
      },
      redrawStructure(id) {
        console.log('Find structure id', id, 'and colour it!')
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