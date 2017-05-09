<template>
  <div id='map'></div>
</template>

<script>
  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'

  export default {
    name: 'TaskerMap',
    props: ['clusters', 'unsynced_clusters', 'selected_spray_team'],
    data() {
      return {
        map: {},
        search_results_layer: null,
      }
    },
    watch: {
      'clusters': 'draw_clusters',
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
        let redrawing

        // Remove if exists
        if (this.search_results_layer) {
          redrawing = true
          this.map.removeLayer(this.search_results_layer)
          this.search_results_layer = null
        }

        // Return unless there are search_results to render
        if (this.clusters.length === 0) {
          return
        }

        const search_results_layer = L.geoJSON(this.clusters, {
          style: (feature, layer) => {
            let style
            switch(feature.properties.spray_team_id){
              case 'no team': style = { color: 'grey' }; break
              case 'spray_team_1': style = { color: 'green' }; break
              case 'spray_team_2': style = { color: 'blue' }; break
              case 'spray_team_3': style = { color: 'orange' }; break
              default: style = {color: 'red'}
            }
            return style
          },
          onEachFeature: (feature, layer) => {
            layer.on('click', () => {
              this.assign_spray_team(feature)
            })
          }
        })
        this.map
          .addLayer(search_results_layer)

        if (!redrawing) this.map.fitBounds(search_results_layer.getBounds())
        this.search_results_layer = search_results_layer
      },
      assign_spray_team(cluster) {
        if(!this.selected_spray_team) return

        cluster.properties.spray_team_id = this.selected_spray_team.id
        this.$store.dispatch("irs:update_cluster", cluster)
      },
    }
  }
</script>

<style scoped>
  .container { margin: 10px; }

  #map {
    min-height: calc(100vh - 200px);
    z-index: 0;
  }

  #spray_team_selector {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;    
  }

</style>