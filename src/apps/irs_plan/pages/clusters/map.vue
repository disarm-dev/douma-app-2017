<template>
  <div>
    <md-button @click.native='load'>load</md-button>
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
        clusters_layer: null,
      }
    },
    watch: {
      '$store.state.irs_plan.clusters': 'draw_clusters',
    },
    mounted() {
      this.create_map()
      this.draw_clusters()
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
      draw_clusters() {
        // Remove if exists
        if (this.clusters_layer) {
          this.map.removeLayer(this.clusters_layer)
          this.clusters_layer = null
        }

        // Return unless there are search_results to render
        if (this.$store.state.irs_plan.clusters.length === 0) {
          return
        }

        // Create GeoJSON from search_results
        // const geojson_search_results = this.$store.state.irs_plan.clusters.map(cluster => {
          // cluster.polygon.properties.original_cluster = cluster
          // return cluster.polygon
        // })

        this.clusters_layer = L.geoJSON(this.$store.state.irs_plan.clusters, {
          style: (feature, layer) => {
              return { color: 'yellow' }
          },
          onEachFeature: (feature, layer) => {
            layer.on('click', () => {
              // let cluster = Object.assign({}, feature.properties)
              // this.select_cluster(cluster.original_cluster)
            })
          }
        })
        this.map
          .addLayer(this.clusters_layer)
          .fitBounds(this.clusters_layer.getBounds())
      },
      select_cluster(cluster) {
        this.$router.push({name: 'irs_plan:cluster', params: {cluster_id: cluster._id}})
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