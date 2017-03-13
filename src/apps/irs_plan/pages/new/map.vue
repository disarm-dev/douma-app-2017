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
        risk_slider: 1,
        slider_options: {
          min: 1,
          max: 10,
          interval: 1
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
        console.log('draw', Localities)
        this.map.on('load', () => {
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
          
        })
      },
      draw_clusters() {
        let map = this.map
        fetch('/assets/swz.all-clusters.json')
        .then((res) => res.json())
        .then((clusters) => {
          clusters.features = clusters.features.slice(0, 500)
          this.slider_options.max = clusters.features.length
          window.clusters = clusters

          map.on('load', () => {
            map.addLayer({
              'id': 'clusters',
              'type': 'line',
              'source': {
                'type': 'geojson',
                'data': clusters
              }
            })
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