<template>
  <div>
    <vue-slider v-bind="slider_options" v-model="risk_slider"></vue-slider>
    <span>{{risk_slider}} clusters</span>
    <md-button @click.native="draw_localities()">draw localities</md-button>
    <md-button @click.native.stop="draw_clusters()">draw clusters</md-button>
    <md-button @click.native.stop='download_clusters'>dowload clusters</md-button>
    <div id="map"></div>
  </div>
</template>

<script>
  import vueSlider from 'vue-slider-component'
  import MapboxGL from 'mapbox-gl/dist/mapbox-gl'
  import 'mapbox-gl/dist/mapbox-gl.css'
  import download from 'downloadjs'
  // import Localities from '../../localities.json'
  var Localities = []

  MapboxGL.accessToken = 'pk.eyJ1Ijoibmljb2xhaWRhdmllcyIsImEiOiJjaXlhNWw1NnkwMDJoMndwMXlsaGo5NGJoIn0.T1wTBzV42MZ1O-2dy8SpOw'

  export default {
    name: 'ResultMap',
    components: {vueSlider},
    data() {
      return {
        clusters: [],
        map: null,
        risk_slider: 1,
        slider_options: {
          lazy: true,
          min: 1,
          max: 10,
          interval: 1
        }
      }
    },
    watch: {
      'risk_slider': 'change_risk_slider'
    },
    activated() {
      if (this.map) this.map.resize()
    },
    mounted() {
      this.draw_map()
    },
    methods: {
      download_clusters() {
        const filtered_clusters = this.clusters.features.filter(c => c.properties.cluster_id < this.risk_slider)
        const featureCollection = {
          type: 'FeatureCollection',
          features: filtered_clusters
        }
        const filtered_clusters_string = JSON.stringify(featureCollection)
        download(filtered_clusters_string, 'clusters.json', 'application/json')
      },
      draw_map() {
        this.map = new MapboxGL.Map({
          container: 'map', // container id
          style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
          center: [31.5, -26.50], // starting position
          zoom: 8 // starting zoom
        });

        this.map.on('render', e => {
          if (this.loading && this.map.loaded()) {
            this.$store.commit('root:set_loading', false)
            this.loading = false
          }
        })
      },
      draw_localities() {
        if (!this.map.loaded()) return

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

        this.$store.commit('root:set_loading', true)
        this.loading = true

        fetch('/assets/swz.all-clusters.json')
        .then((res) => res.json())
        .then((clusters) => {
          this.clusters = clusters
          this.slider_options.max = clusters.features.length

          let _cluster_layer = this.map.addLayer({
            'id': 'clusters',
            'type': 'line',
            'source': {
              'type': 'geojson',
              'data': clusters
            }
          })

        }).catch(console.log)
      },
      change_risk_slider() {
        this.$store.commit('root:set_loading', true)
        this.loading = true

        this.map.setFilter('clusters', ['<', 'cluster_id', this.risk_slider])
      }
    }
  }
</script>

<style>
  #map {
    min-height: 80vh;
  }
</style>