<template>
  <div id="irs-map"></div>
</template>

<script>
  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'

  export default {
    data() {
      return {
        leMap: null
      }
    },
    computed: {
      structures () { return this.$store.state.irs.structures },
    },
    mounted() {
      this.createMap()
    },
    // activated() {
    //   this.renderEntitiesLayer()
    // },
    watch: {
      '$store.state.irs.activeAction': 'redrawEntityLayer',
    },
    methods: {
      createMap(){
        // Configure basic map
        this.leMap = Leaflet.map('irs-map', {
          center: [-26.3231769,31.1380957], // TODO: @refac Make the map center a bit more dynamic? With GPS?
          zoom: 15,
          tms: true
        });
        // Add basemap
        const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        Leaflet.tileLayer(url).addTo(this.leMap);
      },
      renderEntitiesLayer() {
        let entitiesLayer = window.douma.data.irs.entitiesLayer

        if (this.entitiesLayer) {
          return
        }

        if (!this.$store.state.irs.structures || this.$store.state.irs.structures.length === 0) {
          return
        }

        this.structuresFeatureCollection = {
          type: "FeatureCollection",
          features: this.$store.state.irs.structures.map((s) => {
            let {geometry, ...properties} = s
            return {
              type: 'Feature',
              geometry,
              properties
            }
          })
        }

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
              this.$store.commit('irs:setActiveLayer', feature.properties.layerId)
              this.$store.commit('irs:setActiveStructure', feature.properties._id)
              this.$router.push({name: 'irs:form'})
            })

            // layer.on('contextmenu', (e) => {
            //   this.$store.commit('irs:setActiveStructure', feature.properties)
            //   const changedStructured = Object.assign(feature.properties, {actioned: !feature.properties.actioned})
            //   this.$store.commit('irs:updateStructure', changedStructured)
            // })

          }
        })

        this.structuresLayer.addTo(this.leMap)
        this.leMap.fitBounds(this.structuresLayer.getBounds())

        // // listen for when structure is selected from list
        // // so the structure on the map can be recoloured when saved
        // document.addEventListener('selectList', (e) => {
        //   this.$store.commit('irs:setActiveLayer', this.getLayerIdForStructure(e.detail))
        // }, false);
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