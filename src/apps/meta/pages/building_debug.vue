<template>
  <div id="map"></div>
</template>

<script>
  import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
  export default {
    name: 'building_debug',
    data () {
      return {
        _map: {},
      }
    },
    computed: {
      map_focus() {
        return this.$store.state.instance_config.map_focus
      }
    },
    mounted() {
      this.create_map().then(() => {
        console.log('loaded')
      })

    },
    methods: {
      create_map() {
        mapboxgl.accessToken = 'pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        return new Promise((resolve, reject) => {
          this._map = new mapboxgl.Map({
            container: 'map', // container id
            style: {version: 8, sources: {}, layers: [{id: 'background', type: 'background', paint: {'background-color': '#E2E6E3'}}]}, 
            center: [this.map_focus.centre.lng, this.map_focus.centre.lat], zoom: this.map_focus.zoom
          });
          this._map.addControl(new mapboxgl.GeolocateControl());
          this._map.on('load', () => resolve())
        })
      },    
    }
  }
</script>

<style scoped>
  #map {
    height: calc(80vh - 200px);
  }
</style>
