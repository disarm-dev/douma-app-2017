<template>
  <div id='map'></div>
</template>

<script>
  import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'

  export default {
    name: 'ClustersSearchMap',
    props: ['clusters'],
    data() {
      return {
        _map: null,
        clusters_layer: null
      }
    },
    watch: {
      'clusters': 'draw_clusters',
      '$parent.clusters_to_open': 'draw_clusters',
    },
    mounted() {
      this.create_map().then(() => {
        this.draw_clusters()
        this.handle_click()
      })
    },
    methods: {
      create_map() {
        let country = this.$store.state.meta.country
        mapboxgl.accessToken = 'pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        return new Promise((resolve, reject) => {
          this._map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
            center: [country.centre.lng, country.centre.lat],
            zoom: country.zoom
          });
          this._map.on('load', () => resolve())
        })
      },
      draw_clusters() {

        if (this._map.getLayer('clusters_excluded')) {
          this._map.removeLayer('clusters_excluded')
          this._map.removeSource('clusters_excluded')
        }

        if (this._map.getLayer('clusters_included')) {
          this._map.removeLayer('clusters_included')
          this._map.removeSource('clusters_included')
        }

        
        this._map.addLayer({
          'id': 'clusters_excluded', // every locality, doesn't change
          'type': 'fill',
          'source': {
            'type': 'geojson',
            'data': {type: 'FeatureCollection', features: this.clusters }
          },
          'paint': {
            'fill-opacity': 0.5,
            'fill-color': 'grey'
          }
        }) 
        this._map.addLayer({
          'id': 'clusters_included', // every locality, doesn't change
          'type': 'fill',
          'source': {
            'type': 'geojson',
            'data': {type: 'FeatureCollection', features: this.$parent.clusters_to_open }
          },
          'paint': {
            'fill-outline-color': 'grey',
            'fill-opacity': 0.5,
            'fill-color': 'green'
          }
        }) 
      },
      handle_click() {
        this._map.on('click', (e) => {
          const clicked_features = this._map.queryRenderedFeatures(e.point, {layers: ['clusters_excluded']})
          if (clicked_features.length === 0) return
          const cluster_id = clicked_features[0].properties.cluster_id // Assume we only get a single feature
          
          let cluster = this.clusters.find(c => c.properties.cluster_id === cluster_id)
          
          let clusters_to_open = this.$parent.clusters_to_open
          if (clusters_to_open.includes(cluster)) {
            const index = clusters_to_open.findIndex(c => c._id === cluster._id)
            clusters_to_open.splice(index, 1)
          } else {
            clusters_to_open.push(cluster)
          }
        })        
      }
    }
  }
</script>

<style scoped>
  #map {
    min-height: calc(100vh - 250px);
    z-index: 0;
  }
</style>