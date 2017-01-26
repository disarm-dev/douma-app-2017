<template>
  <div id="irs-map"></div>
</template>

<script>
  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'

  export default {
    mounted() {
      this.createMap()
    },
    activated() {
      this.renderEntitiesLayer()
    },
    // watch: {
    //   '$store.state.irs.activeAction': 'redrawEntityLayer',
    // },
    methods: {
      createMap(){
        // Configure basic map
        let leMap = Leaflet.map('irs-map', {
          center: [-26.3231769,31.1380957], // TODO: @refac Make the map center a bit more dynamic? With GPS?
          zoom: 15,
          tms: true
        });

        // Add basemap
        const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'
        Leaflet.tileLayer(url).addTo(leMap);

        window.douma.data.irs.leMap = leMap
      },

      renderEntitiesLayer() {
        let leMap = window.douma.data.irs.leMap
        let entitiesLayer = window.douma.data.irs.entitiesLayer
        const entities = window.douma.data.irs.entities

        if (entitiesLayer) {
          return
        }

        if (entities.length === 0) {
          return
        }

        const entitiesFeatureCollection = {
          type: "FeatureCollection",
          features: entities
        }
        entitiesLayer = Leaflet.geoJSON(entitiesFeatureCollection, {
          style: (feature) => {
            return this.colourStructure(feature)
          },
          onEachFeature: (feature, layer) => {
            // Make sure each feature has its layerId set as a property. This way
            // the feature alone can be passed for editing, and have the specific
            // GeoJSON layer update when editing is finished.
            feature.properties.layerId = L.stamp(layer)


            layer.on('click', () => {
              this.$store.dispatch('irs:setActiveActionById', feature.properties.id) // This is the related Action's ID
              this.$router.push({name: 'irs:form'})
            })

            // layer.on('contextmenu', (e) => {
            //   this.$store.commit('irs:setActiveStructure', feature.properties)
            //   const changedStructured = Object.assign(feature.properties, {actioned: !feature.properties.actioned})
            //   this.$store.commit('irs:updateStructure', changedStructured)
            // })

          }
        })

        entitiesLayer.addTo(leMap)
        leMap.fitBounds(entitiesLayer.getBounds())

        window.douma.data.irs.entitiesLayer = entitiesLayer
      },
      // Responds to a $watch on `$store.state.irs.activeAction`, and will find the layer for 
      // the `osm_id` of the current `activeAction`, then redraw it
      redrawEntityLayer() {
        const layer = window.douma.data.irs.entitiesLayer


        if (this.$store.state.irs.activeLayer) {
          structures.get(this.$store.state.irs.activeStructure).then((structure) => {
            actions.get(structure.action).then((action) => {
              const layerId = this.$store.state.irs.activeLayer  
              const layerToRedraw = this.structuresLayer.getLayer(layerId)

              layerToRedraw.feature.properties.actioned = action.actioned
              
              this.structuresLayer.resetStyle(layerToRedraw)  
            }).catch(err => console.log(err))
          }).catch(err => console.log(err))        
        }
      },
      colourStructure(structureFeature){
        if (structureFeature.properties.actioned) {
          return {color: 'green'}
        } else {
          return {color: 'red'}
        }
      },
      getLayerIdForStructure(structureId) {
        let layer = this.structuresLayer.getLayers().find((layer) => {
          return layer.feature.properties._id === structureId
        })
        let {feature: {properties: {layerId: id}}} = layer
        return id 
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