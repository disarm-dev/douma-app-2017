<template>
  <div>
    <div id='map'></div>
  </div>
</template>

<script>
  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'

  export default {
    name: 'ClustersMap',
    data() {
      return {
        map: {},
        search_results_layer: null
      }
    },
    watch: {
      '$store.state.irs_record.clusters': 'draw_search_results',
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
        if (this.search_results_layer) {
          this.map.removeLayer(this.search_results_layer)
          this.search_results_layer = null
        }

        // Return unless there are search_results to render
        if (this.$store.state.irs_record.clusters.length === 0) {
          return
        }

        // Create GeoJSON from search_results
        const geojson_search_results = this.$store.state.irs_record.clusters.map(cluster => {
          cluster.polygon.properties.original_cluster = cluster
          return cluster.polygon
        })

        this.search_results_layer = L.geoJSON(geojson_search_results, {
          style: (feature, layer) => {
              return { color: 'lightblue' }
          },
          onEachFeature: (feature, layer) => {
            layer.on('click', () => {
              let cluster = Object.assign({}, feature.properties)
              this.select_cluster(cluster.original_cluster)
            })
          }
        })
        this.map
          .addLayer(this.search_results_layer)
          .fitBounds(this.search_results_layer.getBounds())
      },
      select_cluster(cluster) {
        this.$router.push({name: 'irs_record:cluster', params: {cluster_id: cluster._id}})
      }
    }
  }
</script>

<style scoped>
  #map {
    min-height: calc(100vh - 64px);
    z-index: 0;
  }
</style>