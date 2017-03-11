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
        root = 'http://130.211.60.133:3000/processor/tiles/' //2016-01-01_PRECIP/1/1/1.png
        return `${root}/${this.date}_${this.layer.slug}/{z}/{x}/{y}.png`
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

        if (this.tile_layer) {
          console.log('remove tile_layer')
        }
        console.log('map going to get', this.tile_url)
        this.tile_layer = 'layer got for ' + this.tile_url
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