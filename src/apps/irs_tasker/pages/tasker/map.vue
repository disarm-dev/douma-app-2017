<template>
  <div style='position: relative;'>
    <div id='map'></div>
    <md-menu id='spray_team_selector' md-direction="bottom right">
      <md-button md-menu-trigger class='md-raised'>
        {{ selector_title }}
      </md-button>

      <md-menu-content>
        <md-menu-item v-for='spray_team in spray_team_options' @selected='select_spray_team(spray_team)'>{{spray_team.name}}</md-menu-item>
      </md-menu-content>
    </md-menu>
  </div>
</template>

<script>
  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'

  export default {
    name: 'TaskerMap',
    data() {
      return {
        spray_team_options: [
          { id: 'spray_team_1', name: 'Spray team 1'},
          { id: 'spray_team_2', name: 'Spray team 2'},
          { id: 'spray_team_3', name: 'Spray team 3'}
        ],
        map: {},
        search_results_layer: null,
        selected_spray_team: null
      }
    },
    watch: {
      '$store.state.irs_tasker.clusters': 'draw_clusters',
    },
    mounted() {
      this.create_map()
    },
    computed: {
      selector_title() {
        return this.selected_spray_team ? this.selected_spray_team.name : "Select spray team"
      }
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
          const cluster_clone = JSON.parse(JSON.stringify(cluster))
          cluster.polygon.properties.original_cluster = cluster_clone
          return cluster.polygon
        })

        const search_results_layer = L.geoJSON(geojson_search_results, {
          style: (feature, layer) => {
            let style
            switch(feature.properties.original_cluster.spray_team_id){
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
              // let cluster = Object.assign({}, feature.properties)
              this.assign_spray_team(feature.properties.original_cluster)
            })
          }
        })
        this.map
          .addLayer(search_results_layer)

        if (!redrawing) this.map.fitBounds(search_results_layer.getBounds())
        this.search_results_layer = search_results_layer
      },
      assign_spray_team(original_cluster) {
        if(!this.selected_spray_team) return

        original_cluster.spray_team_id = this.selected_spray_team.id

        this.$store.dispatch("irs_tasker:save_cluster", original_cluster)
      },
      select_spray_team(spray_team){
        this.selected_spray_team = spray_team
      }
    }
  }
</script>

<style scoped>
  #map {
    min-height: calc(100vh - 64px);
    z-index: 0;
  }

  #spray_team_selector {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;    
  }

</style>