<template>
  <div>
    <md-input-container>
      <label>OSM ID</label>
      <md-input v-model="osm_id"></md-input>
    </md-input-container>
    <div id="map"></div>
    <div class="container">
      <md-button @click.native="add_buildings('mpaka')">Mpaka</md-button>
      <md-button @click.native="add_buildings('hlane')">Hlane</md-button>
      <md-button @click.native="add_buildings('simunye')">Simunye</md-button>
    </div>
    <md-list>
      <md-list-item v-for="location in locations" :key="location.timestamp">
        <md-icon>location_searching</md-icon>
        <span>{{ human_time(location.timestamp) }} ({{location.coords.accuracy}}m, {{location.duration}}s)</span>

        <md-list-expand>
          <p>{{location}}</p>
          <md-button @click.native='delete_location(location)' class='md-warn'>Delete</md-button>
        </md-list-expand>
      </md-list-item>
    </md-list>
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
        osm_id: '',
        _map: {},
        _buildings_layer: null,
      }
    },
    computed: {
      locations() {
        return this.$store.state.meta.locations
      },
      map_focus() {
        return this.$store.state.instance_config.map_focus
      },
      mpaka() { return mpaka },
      hlane() { return hlane },
      simunye() { return simunye }
    },
    watch: {
      'osm_id': 'highlight_building'
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
              this.get_current_position(feature)
             })
           }
        })

        this._buildings_layer.addTo(this._map)
      },
      create_position_object(position, duration, feature_osm_id) {
        position.duration = duration
        position.osm_id = feature_osm_id
        position.username = this.$store.state.meta.user.username
        position.id = uuid()
        position.user_agent = navigator.userAgent

        return position
      },
      get_current_position(feature) {
        if(this.highlighted_building_id) return
        this.getting_position = true


        const start_stamp = moment()
        const options = {enableHighAccuracy: this.enableHighAccuracy}

        get_current_position(options).then((position) => {

          this.getting_position = false

          const end_stamp = moment()
          const duration = this.get_duration(start_stamp, end_stamp)

          position = this.create_position_object(position, duration, feature.properties.osm_id)
          this.add_location(position)
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
