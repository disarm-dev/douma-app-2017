<template>
  <div>
    <p>Clicked on osm_id: {{osm_id_from_map}}</p>
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
    <md-button class='md-raised md-primary' @click.native="get_current_position" :disabled='getting_position'>Get current location</md-button>
    <md-checkbox v-model="enableHighAccuracy">High accuracy</md-checkbox>
    <md-button class='md-raised md-accent' @click.native='sync' :disabled='syncing'>Sync</md-button>

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
  import {get_current_position} from '../../../lib/location_helper.js'
  import moment from 'moment'
  import uuid from 'uuid/v4'

  import mpaka from '../../../../static/geo/mpaka_buildings.json'
  import hlane from '../../../../static/geo/hlane_buildings.json'
  import simunye from '../../../../static/geo/simunye_buildings.json'

  export default {
    name: 'building_debug',
    data () {
      return {
        osm_id: '',
        osm_id_from_map: '',
        _map: {},
        _buildings_layer: null,
        syncing: false,
        enableHighAccuracy: false,
        getting_position: false
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
                this.osm_id_from_map = feature.properties.osm_id
             })
           }
        })

        this._buildings_layer.addTo(this._map)
      },
      highlight_building() {
        this._buildings_layer.setStyle((feature, layer) => {
          const regex = new RegExp(this.osm_id + "$")
          if (this.osm_id && regex.test(feature.properties.osm_id)) {

             let base_style = {
               weight: 0.8,
               color: 'red'
             }

             return base_style
          } else {
            return {color: '#3388ff'}
          }
         })
      },
      human_time(timestamp) {
        return moment(timestamp).format('kk:mm:ss:SS ddd')
      },
      create_position_object(position, duration) {
        if (this.osm_id) {
          position.osm_id = this.osm_id  
        }
        position.duration = duration
        position.username = this.$store.state.meta.user.username
        position.id = uuid()
        position.user_agent = navigator.userAgent
        return position
      },
      get_current_position(feature) {
        this.getting_position = true


        const start_stamp = moment()
        const options = {enableHighAccuracy: this.enableHighAccuracy}

        get_current_position(options).then((position) => {
          this.getting_position = false

          const end_stamp = moment()
          const duration = this.get_duration(start_stamp, end_stamp)

          const new_position = this.create_position_object(position, duration)
          this.add_location(new_position)
        })
      },
      add_location(position) {
        this.$store.commit('meta/add_location', position)
      },
      delete_location(position) {
        this.$store.commit('meta/delete_location', position)
      },
      get_duration(start_stamp, end_stamp) {
        return moment.utc(moment(end_stamp,"DD/MM/YYYY HH:mm:ss").diff(moment(start_stamp,"DD/MM/YYYY HH:mm:ss"))).format("s")
      },
      sync() {
        this.syncing = true
        Promise.all(
          this.locations
            .map((location) => {
              return fetch(`https://disarm-platform.firebaseio.com/locations/${location.id}.json`, {
                method: 'PUT',
                body: JSON.stringify(location)
              }).then(() => {
                this.$store.commit('meta/delete_location', location)
              })
            })
        ).then(res => {
          this.syncing = false
        })
      }
    }
  }
</script>

<style scoped>
  #map {
    height: calc(80vh - 200px);
  }
</style>
