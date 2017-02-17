<template>
  <div id='map'></div>
</template>

<script>
  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'

  export default {
    name: 'TaskerMap',
    data() {
      return {
        map: {},
        search_results_layer: null,
        spray_team_id: 'spray_team_1'
      }
    },
    watch: {
      '$store.state.irs_tasker.clusters': 'draw_clusters',
    },
    mounted() {
      this.create_map()
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
        console.log('draw_clusters')
        // Remove if exists
        let redrawing

        if (this.search_results_layer) {
          redrawing = true
          this.map.removeLayer(this.search_results_layer)
          this.search_results_layer = null
        }

        // Return unless there are search_results to render
        if (this.$store.state.irs_tasker.clusters.length === 0) {
          return
        }

        // Create GeoJSON from search_results
        const geojson_search_results = this.$store.state.irs_tasker.clusters.map(cluster => {
          cluster.polygon.properties.original_cluster = cluster
          return cluster.polygon
        })

        const search_results_layer = L.geoJSON(geojson_search_results, {
          style: (feature, layer) => {
            let style
            switch(feature.properties.original_cluster.spray_team_id){
              case 'no team': style = { color: 'grey' }; break
              case 'spray_team_1': style = { color: 'green' }; break
              default: style = {color: 'red'}
            }
            return style
          },
          onEachFeature: (feature, layer) => {
            layer.on('click', () => {
              // let cluster = Object.assign({}, feature.properties)
              this.assign_spray_team(feature.properties.original_cluster, this.spray_team_id)
            })
          }
        })
        this.map
          .addLayer(search_results_layer)

        if (!redrawing) this.map.fitBounds(search_results_layer.getBounds())
        this.search_results_layer = search_results_layer
      },
      assign_spray_team(original_cluster, spray_team_id) {
        const cluster_index = this.$store.state.irs_tasker.clusters.findIndex(c => c._id === original_cluster._id)
        original_cluster.spray_team_id = spray_team_id
        this.$store.state.irs_tasker.clusters.splice(cluster_index, 1, original_cluster)
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