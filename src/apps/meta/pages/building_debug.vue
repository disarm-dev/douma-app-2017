<template>
  <div>
    <div id="map"></div>
    <div class="container">
      <md-button @click.native="add_buildings('mpaka')">Mpaka</md-button>
      <md-button @click.native="add_buildings('hlane')">Hlane</md-button>
      <md-button @click.native="add_buildings('simunye')">Simunye</md-button>
    </div>
  </div>
</template>

<script>
  import Leaflet from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  import locatecontrol from 'leaflet.locatecontrol'
  import mpaka from '../../../../static/geo/mpaka_buildings.json'
  import hlane from '../../../../static/geo/hlane_buildings.json'
  import simunye from '../../../../static/geo/simunye_buildings.json'

  export default {
    name: 'building_debug',
    data () {
      return {
        _map: {},
        _buildings_layer: null,
      }
    },
    computed: {
      map_focus() {
        return this.$store.state.instance_config.map_focus
      },
      mpaka() { return mpaka },
      hlane() { return hlane },
      simunye() { return simunye }
    },
    mounted() {
      this.create_map()
    },
    methods: {
      create_map() {
        this._map = Leaflet.map('map', {
          tms: true,
          center: [this.map_focus.centre.lat, this.map_focus.centre.lng],
          zoom: this.map_focus.zoom
        });

        const url = 'https://api.mapbox.com/styles/v1/onlyjsmith/civ9t5x7e001y2imopb8c7p52/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA'

        L.control.locate().addTo(this._map);

        Leaflet.tileLayer(url).addTo(this._map);
      },
      add_buildings(place) {
        if(typeof this._buildings_layer !== 'undefined') {
          this._map.removeLayer(this._buildings_layer)
          this._buildings_layer = null
        }


        this._buildings_layer = L.geoJSON(this[place], {
           style: (feature, layer) => {
             let base_style = {
               weight: 0.8
             }

             return base_style
           },
           onEachFeature: (feature, layer) => {
             layer.on('click', () => {
               console.log(feature.properties.osm_id)
             })
           }
        })

        this._buildings_layer.addTo(this._map)
      }
    }
  }
</script>

<style scoped>
  #map {
    height: calc(80vh - 200px);
  }
</style>
