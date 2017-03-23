<template>
  <div class="weather">
    <opacity-slider v-if="selected_layer" :layer="tile_layer"></opacity-slider>
    <legend-component v-if='has_legend' :layer="layer" :country="country"></legend-component>
    <div id="weather-map"></div>
  </div>
</template>

<script>
  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  import OpacitySlider from '../../../components/opacitySlider.vue'
  import LegendComponent from './legend.vue'

  export default {
    name: 'RastersMap',
    props: ['date', 'layer', 'country'],
    components: {OpacitySlider, LegendComponent},
    mounted() {
      this.create_map()
        .then(this.add_country_boundary)
    },
    watch: {
      'date': 'change_tile_layer', 
      'layer': 'change_tile_layer',
      'country': 'change_country'
    },
    data () {
      return {
        map: null,
        tile_layer: null,
        country_boundary_layer: null,
        opacity_slider: null
      }
    },
    computed: {
      tile_url() {
        if (!this.layer || !this.date) return 

        if (this.layer.slug === 'RISK') {
          return `https://storage.googleapis.com/pipeline-api/api/${this.country.slug}/${this.date}/risk/standard/current-month/tiles/{z}/{x}/{y}.png`
        } else {
          const root_url = WEATHER_API_URL
          const url = `${root_url}/${this.country.slug}/tile/${this.date}_${this.layer.slug}/{z}/{x}/{y}.png`
          return url
        }
      },
      selected_layer() {
        return this.$store.state.rasters.selected_layer
      },
      has_legend() {
        return this.layer !== 'RISK'
      }
    },
    methods: {
      create_map() {
        this.map = Leaflet.map('weather-map', {
          center: this.country.centre,
          zoom: this.country.zoom
        });

        const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        Leaflet.tileLayer(url).addTo(this.map)
        return Promise.resolve()
      },
      add_country_boundary() {
        console.log('wtf')
        fetch(`/assets/countries/${this.country.slug}.geojson`)
        .then((res) => {
          return res.json()
        }).then((boundary) => {
          this.country_boundary_layer = L.geoJSON(boundary, {
            style: {
              fill: false,
              color: 'grey',
              weight: 0.7,
              clickable: false
            }
          })
          this.country_boundary_layer.addTo(this.map)
        }).catch()
      },
      change_tile_layer() {
        if (!this.layer || !this.date) return

        if (this.tile_layer) {
          this.map.removeLayer(this.tile_layer)
          this.tile_layer = null
        }

        this.tile_layer = L.tileLayer(this.tile_url, {tms: true})
        this.tile_layer.addTo(this.map)
        if (this.country_boundary_layer) this.country_boundary_layer.bringToFront()
      },
      change_country() {
        this.map.setView(this.country.centre, this.country.zoom)
      }
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