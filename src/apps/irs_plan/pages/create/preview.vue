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
  import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
  import 'mapbox-gl/dist/mapbox-gl.css'

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
        mapboxgl.accessToken = 'pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA';
        this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [31.50484892885717, -26.543508675283874],
            zoom: 7.34
        });
      },
      draw_clusters(json) {
        this.map.on('load', () => {
          console.log('draw_clusters')
          const clusters_layer = this.map.addLayer({
            id: 'some_id', 
            type: 'fill',
            layout: {},
            paint: {
              'fill-color': '#088',
              'fill-opacity': 0.8
            },
            source: {
              type: 'geojson',
              data: json
            }
          });
          this.clusters_layer = clusters_layer
        })
      }
      // draw_clusters(json) {
      //   let redrawing
      //   const clusters_data = json

      //   // Remove if exists
      //   if (this.clusters_layer) {
      //     redrawing = true
      //     this.map.removeLayer(this.clusters_layer)
      //     this.clusters_layer = null
      //   }

      //   // Return unless there are search_results to render
      //   if (clusters_data.length === 0) {
      //     return
      //   }

      //   const clusters_layer = L.geoJSON(clusters_data, {
      //     style: (feature, layer) => {
      //         return { color: 'yellow' }
      //     },
      //     onEachFeature: (feature, layer) => {
      //       layer.on('click', () => {
      //         // let cluster = Object.assign({}, feature.properties)
      //         // this.select_cluster(cluster.original_cluster)
      //       })
      //     }
      //   })

      //   this.map
      //     .addLayer(clusters_layer)

      //   if (!redrawing) this.map.fitBounds(clusters_layer.getBounds())
      //   this.clusters_layer = clusters_layer
      // }
    }
  }
</script>

<style scoped>
  #map {
    min-height: calc(100vh - 250px);
    z-index: 0;
  }
</style>