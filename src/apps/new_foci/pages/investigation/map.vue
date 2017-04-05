<template>
  <div id="map"></div>
</template>

<script>
  import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
  import {mapState, mapGetters} from 'vuex'

  export default {
    name: 'SingleFociMap',
    props: ['foci'],
    watch: {
    },
    activated() {

    },
    created() {
    },
    mounted() {
      this.create_map().then(() => {
        this._map.resize()
        this.add_foci_layer()
      })
    },
    data () {
      return {
        _map: null
      }
    },
    computed: {
    },
    methods: {
      create_map() {
        mapboxgl.accessToken = 'pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        return new Promise((resolve, reject) => {
          this._map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
            center: [31.92003, -26.21082],
            zoom: 16
          });
          this._map.on('load', () => resolve())
        })
      },
      add_foci_layer() {
        console.log(this.focis)
        this._map.addLayer({
          'id': 'formal_areas_layer', // every locality, doesn't change
          'type': 'fill',
          'source': {
            'type': 'geojson',
            'data': {type: 'FeatureCollection', features: [this.foci] }
          },
          'paint': {
            'fill-outline-color': 'grey',
            'fill-opacity': 0.5,
            'fill-color': {
                property: 'status',
                type: 'categorical',
                stops: [
                    ['Active', '#F44336'],
                    ['Inactive', '#FF9800'],
                    ['Cleared', '#4CAF50']
                ]
            }
          }
        }) 
      }
    }

  }
</script>

<style>.md-tab{padding: 0 !important;}</style>