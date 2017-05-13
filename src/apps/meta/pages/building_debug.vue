<template>
  <div id="map"></div>
</template>

<script>
  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  import locatecontrol from 'leaflet.locatecontrol'

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
      this.create_map()
    },
    methods: {
      create_map() {
        this._map = Leaflet.map('map', {
          tms: true,
          center: [this.map_focus.centre.lng, this.map_focus.centre.lat],
          zoom: this.map_focus.zoom
        });

        const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        // this.map.on('dblclick', () => {
        //   this.$router.push({name: 'irs_record:clusters'})
        // })
        L.control.locate().addTo(this._map);

        Leaflet.tileLayer(url).addTo(this._map);
      },
    }
  }
</script>

<style scoped>
  #map {
    height: calc(80vh - 200px);
  }
</style>
