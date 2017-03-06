<template>
  <div>
    <div class="container">
      <h1>Clustering preview</h1>
      <p>Are you happy with these Clusters?</p>
      <md-button class='md-primary md-raised' @click.native="post_clusters">YES (save)</md-button>
      <md-button class='md-warn' @click.native="$router.push({name: 'irs_plan:create:select_ous'})">NO (start again)</md-button>
    </div>
    <div id='map'></div>
  </div>
</template>

<script>
  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'

  export default {
    name: 'ReviewMap',
    data() {
      return {
        map: {},
        clusters_layer: null,
      }
    },
    watch: {
      // '$store.state.irs.clusters': 'draw_clusters',
    },
    mounted() {
      this.create_map()
      fetch('/assets/swz.clusters.sample.json').then((res) => res.json()).then((json) => {
        window.json = json
        this.draw_clusters(json)
      })
    },
    methods: {
      post_clusters() {
        this.$store.dispatch('irs_plan:post_clusters').then(() => {
          this.$router.push({name: 'irs_plan'})
        })
      }, 
      create_map() {
        this.map = Leaflet.map('map', {
          tms: true,
          center: [-26.3231769,31.1380957],
          zoom: 10,
        });

        const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        Leaflet.tileLayer(url).addTo(this.map)
      },
      draw_clusters(json) {
        let redrawing
        const clusters_data = json

        // Remove if exists
        if (this.clusters_layer) {
          redrawing = true
          this.map.removeLayer(this.clusters_layer)
          this.clusters_layer = null
        }

        // Return unless there are search_results to render
        if (clusters_data.length === 0) {
          return
        }

        const clusters_layer = L.geoJSON(clusters_data, {
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
          .addLayer(clusters_layer)

        if (!redrawing) this.map.fitBounds(clusters_layer.getBounds())
        this.clusters_layer = clusters_layer
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