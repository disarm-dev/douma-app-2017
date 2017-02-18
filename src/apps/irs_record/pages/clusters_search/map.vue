<template>
  <div>
    <h1>ClustersSearchMap</h1>
    <div id='map'></div>
  </div>
</template>

<script>
  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'

  export default {
    name: 'ClustersSearchMap',
    data() {
      return {
        map: {},
        search_results_layer: null
      }
    },
    watch: {
      '$parent.search_results': 'draw_search_results',
      '$parent.clusters_to_open': 'draw_search_results',
    },
    mounted() {
      this.create_map()
      this.draw_search_results()
    },
    methods: {
      create_map() {
        this.map = Leaflet.map('map', {
          tms: true,
          center: [-26.3231769,31.1380957],
          zoom: 10,
        });

        const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        Leaflet.tileLayer(url).addTo(this.map)
      },
      draw_search_results() {
        // Remove if exists
        let redrawing

        if (this.search_results_layer) {
          redrawing = true
          this.map.removeLayer(this.search_results_layer)
          this.search_results_layer = null
        }
        // Return unless there are search_results to render
        if (this.$parent.search_results.length === 0) {
          return
        }

        // Create GeoJSON from search_results
        const geojson_search_results = this.$parent.search_results.map(cluster => {
          cluster.polygon.properties.original_cluster = cluster
          return cluster.polygon
        })

        search_results_layer = L.geoJSON(geojson_search_results, {
          style: (feature, layer) => {
            // Is the feature already in the clusters_to_open array
            const included = this.$parent.clusters_to_open.includes(feature.properties.original_cluster)

            if (included) {
              return { color: 'green' }
            } else {
              return { color: 'grey' }
            }
          },
          onEachFeature: (feature, layer) => {
            layer.on('click', () => {
              let cluster = Object.assign({}, feature.properties)
              this.add_or_remove_from_keep(cluster.original_cluster)
            })
          }
        })
        this.map
          .addLayer(search_results_layer)

        if (!redrawing) this.map.fitBounds(search_results_layer.getBounds())
        this.search_results_layer = search_results_layer

      },
      add_or_remove_from_keep(cluster) {
        let clusters_to_open = this.$parent.clusters_to_open
        if (clusters_to_open.includes(cluster)) {
          const index = clusters_to_open.findIndex(c => c._id === cluster._id)
          clusters_to_open.splice(index, 1)
        } else {
          clusters_to_open.push(cluster)
        }
      }
    }
  }
</script>

<style scoped>
  #map {
    min-height: 85vh;
    z-index: 0;
  }
</style>