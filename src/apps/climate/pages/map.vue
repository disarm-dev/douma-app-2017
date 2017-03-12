<template>
  <div id="map"></div>
</template>

<script>
  import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
  import 'mapbox-gl/dist/mapbox-gl.css'

  export default {
    name: 'ClimateMap',
    props: ['date', 'layer'],
    mounted() {
      this.create_map()
    },
    watch: {'date': 'change_tile_layer', 'layer': 'change_tile_layer'},
    data () {
      return {
        map: null,
        tile_layer: null
      }
    },
    computed: {
      tile_url() {
        const root_url = WEATHER_API_URL
        return `${root_url}/${this.date}_${this.layer.slug}/{z}/{x}/{y}.png`
      }
    },
    methods: {
      create_map() {
        mapboxgl.accessToken = 'pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'
        this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox:// styles/mapbox/streets-v9',
            center: [29.555289514559178, -19.273592175411892],
            zoom: 5
        })

      },
      change_tile_layer() {
        if (!this.layer || !this.date) return


        const source = {
          type: 'raster',
          tiles: [
              this.tile_url
          ]
        }

        const layer = {
          id: 'weather-layer',
          source: 'weather-source',
          type: 'raster'
        }

        this.map.addSource('weather-source', source)
        this.map.addLayer(layer)
        console.log('added')
      }
    }
  }
</script>

<style scoped>
  #map {
    min-height: calc(100vh - 270px);
    z-index: 0;
  }
</style>