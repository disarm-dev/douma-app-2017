<template>
  <div>
    <vue-slider v-bind="slider_options" v-model="risk_slider"></vue-slider>
    <span>{{risk_slider}} clusters</span>
    <md-button @click.native="draw_localities()">draw_localities</md-button>
    <md-button @click.native="draw_clusters()">draw_clusters</md-button>
    <div id="map"></div>
  </div>
</template>

<script>
  import vueSlider from 'vue-slider-component'
  import MapboxGL from 'mapbox-gl/dist/mapbox-gl'
  import 'mapbox-gl/dist/mapbox-gl.css'

  import Localities from '../../localities.json'

  MapboxGL.accessToken = 'pk.eyJ1Ijoibmljb2xhaWRhdmllcyIsImEiOiJjaXlhNWw1NnkwMDJoMndwMXlsaGo5NGJoIn0.T1wTBzV42MZ1O-2dy8SpOw'

  export default {
    name: 'NewMap',
    components: {vueSlider},
    data() {
      return {
        map: null,
        _risk_slider: 1,
        slider_options: {
          min: 1,
          max: 10,
          interval: 1
        }
      }
    },
    computed: {
      risk_slider: {
        set(val) {
          this.map.setFilter('clusters', ['<', 'cluster_id', val])
          this._risk_slider = val
        },
        get() {
          return this._risk_slider
        }
      }
    },
    mounted() {
      this.draw_map()
    },
    methods: {
      draw_map() {
        this.map = new MapboxGL.Map({
          container: 'map', // container id
          style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
          center: [31.5, -26.50], // starting position
          zoom: 8 // starting zoom
        });
      },
      draw_localities() {
        if (!this.map.loaded()) return
        console.log('draw', Localities)

        this.map.addLayer({
          'id': 'localities',
          'type': 'line',
          'source': {
            'type': 'geojson',
            'data': Localities
          },
          'paint': {
            'line-color': '#4FC3F7',
            'line-opacity': 0.7
          }
        })
      },
      draw_clusters() {
        if (!this.map.loaded()) return

        fetch('/assets/swz.all-clusters.json')
        .then((res) => res.json())
        .then((clusters) => {
          console.log(clusters.features[0], clusters.features[1])
          this.slider_options.max = clusters.features.length

          this.map.addLayer({
            'id': 'clusters',
            'type': 'line',
            'source': {
              'type': 'geojson',
              'data': clusters
            }
          })
        }).catch(console.log)
      }
    }
  }
</script>

<style>
  #map {
    min-height: 80vh;
  }
</style>