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
    computed: {
      activeAction() { return this.$store.state.irs.activeAction },
      tasks() { return this.$store.state.irs.tasks } 
    },
    watch: {
      'tasks': 'redrawEntityLayer'
    },
    methods: {
      createMap(){
        // Configure basic map
        let leMap= Leaflet.map('irs-map', {
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
            return {
              color: this.colourForActioned(feature.properties.actioned)
            }
          },
          onEachFeature: (feature, layer) => {
            // Make sure each feature has its layerId set as a property. This way
            // the feature alone can be passed for editing, and have the specific
            // GeoJSON layer update when editing is finished.
            // feature.properties.layerId = L.stamp(layer)

            layer.on('click', () => {
              this.$store.dispatch('irs:setActiveActionByOSMId', feature.properties.osm_id) // This is the related Action's ID
              // TODO: @refac Try to avoid navigating unless certain there's a matching Task
              this.$router.push({name: 'irs:form'})
            })

            // layer.on('contextmenu', (e) => {
            //   this.$store.commit('irs:setActiveStructure', feature.properties)
            //   const changedStructured = Object.assign(feature.properties, {actioned: !feature.properties.actioned})
            //   this.$store.commit('irs:updateStructure', changedStructured)
            // })

          }
        })

        window.douma.data.irs.entitiesLayer = entitiesLayer
        entitiesLayer.addTo(leMap)
        leMap.fitBounds(entitiesLayer.getBounds())
      },

      // Responds to a $watch on `$store.state.irs.tasks`, and will find the layer for 
      // the `osm_id` of the current `activeAction`, then redraw it
      redrawEntityLayer() {
        const leMap = window.douma.data.irs.leMap
        if (!this.activeAction) return

        let layer = this.getLayerIdForOsmId(this.activeAction.osm_id)
        layer.remove()

        layer.options.color = this.colourForActioned(this.activeAction.actioned)
        leMap.addLayer(layer)
      },

      colourForActioned(actioned){
        if (actioned === 'successfulVisit') {
          return 'green'
        } else if (actioned === 'unsuccessfulVisit') {
          return 'red'
        } else {
          return 'orange'
        }
      },

      getLayerIdForOsmId(osm_id) {
        const entitiesLayer = window.douma.data.irs.entitiesLayer

        let layer = entitiesLayer.getLayers().find((layer) => {
          return layer.feature.properties.osm_id === osm_id
        })

        return layer
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