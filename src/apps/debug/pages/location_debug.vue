<template>
  <div class='applet_container'>
    <h3>Debug location for {{instance_slug}} instance</h3>
    <md-input-container>
      <label>Waypoint ID</label>
      <md-input v-model="waypoint_id"></md-input>
    </md-input-container>
    <md-button class='md-raised md-primary' @click.native="get_current_position" :disabled='getting_position'>Get current location</md-button>
    <md-button class='md-raised md-primary' @click.native="toggle_watch_position">{{watching_button_text}}</md-button>
    <md-checkbox v-model="enableHighAccuracy">High accuracy</md-checkbox>
    <md-button class='md-raised md-accent' @click.native='sync' :disabled='syncing'>Sync</md-button>
    <p>{{location_msg}}</p>

    <h2>Errors</h2>
    <md-list>
      <md-list-item v-for="error in errors" :key="errors.timestamp">
      {{pretty(error)}}
      </md-list-item>
    </md-list>

    <md-list>
      <md-list-item v-for="location in locations" :key="location.timestamp">
        <md-icon>location_searching</md-icon>
        <span>{{ human_time(location.timestamp) }} ({{locations.coords ? location.coords.accuracy : ''}}m, {{location.duration}}s)</span>

        <md-list-expand>
          <p>{{location}}</p>
          <md-button @click.native='delete_location(location)' class='md-warn'>Delete</md-button>
        </md-list-expand>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
  import {get_current_position} from 'lib/helpers/location_helper.js'
  import objectify from 'geoposition-to-object'

  import moment from 'moment-mini'
  import uuid from 'uuid/v4'

  export default {
    name: 'location_debug',
    data () {
      return {
        getting_position: false,
        watching_position: false,
        geolocation_watch_id: null,
        syncing: false,
        enableHighAccuracy: false,
        waypoint_id: '',
        errors: []
      }
    },
    computed: {
      locations() {
        return this.$store.state.meta.locations
      },
      location_msg() {
        return this.location_activity || 'No action'
      },
      location() {
        return this.locations[this.locations.length-1] || 'No location set'
      },
      instance_slug() {
        return this.$store.state.instance_config.instance.slug
      },
      location_activity() {
        return this.getting_position ? 'Getting current position' : ''
      },
      watching_button_text() {
        return this.watching_position ? 'Stop watching' : 'Start watching'
      },
      options() {
        return {
          enableHighAccuracy: this.enableHighAccuracy,
          timeout: 30000,
          maximumAge: 120000
        }
      }
    },
    methods: {
      human_time(timestamp) {
        return moment(timestamp).format('kk:mm:ss:SS ddd')
      },
      toggle_watch_position() {
        if(this.watching_position) {
          navigator.geolocation.clearWatch(this.geolocation_watch_id)
        } else {
          this.geolocation_watch_id = navigator.geolocation.watchPosition((found) => {
            let position = objectify(found)
            position = this.create_position_object(position, 'watching')
            this.add_location(position)
          }, (error) => {
            const error_object = {
              code: error.code,
              message: error.message
            }
            this.errors.push(error_object)
          }, this.options)
        }
        this.watching_position = !this.watching_position
      },
      get_current_position() {
        this.getting_position = true

        const start_stamp = moment()

        get_current_position(this.options).then((position) => {

          this.getting_position = false

          const end_stamp = moment()
          const duration = this.get_duration(start_stamp, end_stamp)

          position = this.create_position_object(position, duration)
          this.add_location(position)
        }).catch(error => {
          const error_object = {
            code: error.code,
            message: error.message
          }
          this.getting_position = false
          this.errors.push(error_object)
        })
      },
      create_position_object(position, duration) {
        position.duration = duration
        position.waypoint_id = this.waypoint_id
        position.username = this.$store.state.user.username
        position.id = uuid()
        position.user_agent = navigator.userAgent

        return position
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
      },
      pretty(thing) {
        return JSON.stringify(thing, null, 2)
      }
    }
  }
</script>
