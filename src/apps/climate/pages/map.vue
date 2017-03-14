<template>
  <div class="weather">
    <opacity-slider v-if="selected_layer" :layer="tile_layer"></opacity-slider>
    <legend-component v-if="selected_layer" :layer="layer" :country="country"></legend-component>
    <div id="weather-map"></div>
  </div>
</template>

<script>
  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  import OpacitySlider from './opacitySlider.vue'
  import LegendComponent from './legend.vue'

  export default {
    name: 'ClimateMap',
    props: ['date', 'layer', 'country'],
    components: {OpacitySlider, LegendComponent},
    mounted() {
      this.create_map()
    },
    watch: {'date': 'change_tile_layer', 'layer': 'change_tile_layer'},
    data () {
      return {
        map: null,
        legend: null,
        tile_layer: null,
        opacity_slider: null
      }
    },
    computed: {
      tile_url() {
        const root_url = WEATHER_API_URL
        return `${root_url}/${this.country}/tile/${this.date}_${this.layer.slug}/{z}/{x}/{y}.png`
      },
      selected_layer() {
        return this.$store.state.climate.selected_layer
      }
    },
    methods: {
      create_map() {
        this.map = Leaflet.map('weather-map', {
          center: {lat: -18.656654486540006, lng: 29.575195312500004},
          zoom: 6
        });

        const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        Leaflet.tileLayer(url).addTo(this.map)
      },
      change_tile_layer() {
        if (!this.layer || !this.date) return

        if (this.tile_layer) {
          this.map.removeLayer(this.tile_layer)
          this.tile_layer = null
        }

        this.tile_layer = L.tileLayer(this.tile_url, {tms: true})
        this.tile_layer.addTo(this.map)
      },
    }
  }
</script>

<style>
  .weather {
    position: relative;
  }

  #weather-map {
    min-height: calc(100vh - 270px);
    z-index: 0;
  }

  .legend {
    line-height: 18px;
    color: #555;
  }

  .legend i {
      width: 18px;
      height: 18px;
      float: left;
      margin-right: 8px;
      opacity: 0.7;
  }
</style>