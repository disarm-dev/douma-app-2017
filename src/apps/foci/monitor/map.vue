<template>
  <div class='fab-container'>
    <md-button class="md-fab md-clean" @click.native="$router.push({name: 'foci:monitor:list'})">
      <md-icon>list</md-icon>
    </md-button>
    <div id="monitor-map"></div>
  </div>
</template>

<script>
  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  
  export default {
    data() {
      return {
        map: {},
        structuresLayer: {},
        focisFc: this.$store.state.foci.focis.featureCollection,
        focisLayer: {}
      }
    },
    mounted() {
      this.map = Leaflet.map('monitor-map', {
        tms: true,
        center: [-26.3231769,31.1380957],
        zoom: 10,
      });

      // TODO: @feature Need to stop this fitBounds - it forgets any previous user zooming, etc.
      this.$parent.$on('show', () => {
        this.map.invalidateSize()
        this.map.fitBounds(this.focisLayer.getBounds())
      })

      // const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'
      // Leaflet.tileLayer(url).addTo(this.map); 

      // this.loadStructures()
      this.loadFocis()
    },
    methods: {
      viewList() {
        this.$router.push({name: 'foci:monitor:list'})
      },
      loadFocis() {
        this.focisLayer = Leaflet.geoJSON(this.focisFc, {
          onEachFeature: (feature, layer) => {
            layer.on({
              click: (e) => {
                this.$store.commit('foci:setActiveFoci', feature.properties)
                this.$router.push({name: 'foci:investigate'})
              }
            })
          }
        }).addTo(this.map)
        this.map.fitBounds(this.focisLayer.getBounds())
      },
      // loadStructures() {
      //   // TODO: @refac Move this into the store and use a StructureCollection

      //   // Take Firebase object of structure polygons, return array with 
      //   // `id` as one of the properties
      //   const structuresArray = Helpers.firebaseObjectToArray(firebaseStructures)

      //   // Create FeatureCollection from the structuresArray
      //   const structuresFc = MapHelpers.buildFeatureCollection(structuresArray)
        
      //   // Create FeatureCollection of structure centroids
      //   // const centroidsFc = MapHelpers.convertPolygonsToCentroids(structuresFc)

      //   const structureStyle = {
      //     weight: 1,
      //     color: 'green'
      //   }

      //   const structuresLayer = Leaflet.geoJSON(structuresFc, {
      //       style: (feature) => {
      //         if (feature.properties.casePresent === true) {
      //           return {...structureStyle, color: 'red'}
      //         } else {
      //           return {...structureStyle, color: 'blue'}
      //         }
      //       },
      //       onEachFeature: (feature, layer) => {
      //         layer.on({
      //           click: (e) => {
      //             e.target.setStyle({color: 'orange'})
      //             feature.properties.casePresent = !(feature.properties.casePresent)
      //           }
      //         })
      //       }
      //     }
      //   )

      //   this.structuresLayer = structuresLayer
        
      //   structuresLayer.addTo(this.map)
      //   this.map.fitBounds(structuresLayer.getBounds())
      // }
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

  #monitor-map {
    z-index: 0;
    min-height: 85vh;
    overflow: hidden;
  }

</style>