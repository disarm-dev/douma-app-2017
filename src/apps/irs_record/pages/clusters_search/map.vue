<template>
  <div id='map'></div>
</template>

<script>
  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'

  export default {
    name: 'ClustersSearchMap',
    props: ['clusters'],
    data() {
      return {
        map: {},
        clusters_layer: null
      }
    },
    watch: {
      'clusters': 'draw_clusters',
      '$parent.clusters_to_open': 'draw_clusters',
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
        let redrawing

        if (this.clusters_layer) {
          redrawing = true
          this.map.removeLayer(this.clusters_layer)
          this.clusters_layer = null
        }
        // Return unless there are search_results to render
        if (this.clusters.length === 0) {
          return
        }

        const local_clusters_layer = L.geoJSON(this.clusters, {
          style: (feature, layer) => {
            // Is the feature already in the clusters_to_open array
            const included = this.$parent.clusters_to_open.includes(feature)

            if (included) {
              return { color: 'green' }
            } else {
              return { color: 'grey' }
            }
          },
          onEachFeature: (feature, layer) => {
            layer.on('click', () => {
              this.add_or_remove_from_keep(feature)
            })
          }
        })

        this.map
          .addLayer(local_clusters_layer)

        if (!redrawing) this.map.fitBounds(local_clusters_layer.getBounds())
        this.clusters_layer = local_clusters_layer

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