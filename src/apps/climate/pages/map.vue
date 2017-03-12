<template>
  <div id="map"></div>
</template>

<script>
  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'

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
        tile_layer: null,
        opacity_slider: null
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
        this.map = Leaflet.map('map', {
          center: {lat: -18.656654486540006, lng: 29.575195312500004},
          zoom: 6
        });

        const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        Leaflet.tileLayer(url).addTo(this.map)

        // this.opacity_slider = new L.Control.opacitySlider()
        // this.map.addControl(opacity_slider)

      },
      change_tile_layer() {
        if (!this.layer || !this.date) return

        if (this.tile_layer) {
          this.map.removeLayer(this.tile_layer)
          this.tile_layer = null
        }

        this.tile_layer = L.tileLayer(this.tile_url, {tms: true})//, opacity: 0.6})
        this.tile_layer.addTo(this.map)
        
        // this.opacity_slider.setOpacityLayer(this.tile_layer)
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