<template>
  <div class='applet_container'>
    <h3>Debug location</h3>
    <md-button class='md-raised md-primary' @click.native="get_current_position" :disabled='getting_position'>Get current location</md-button>
    <p>{{location_msg}}</p>

    <h2 v-if="errors.length">Errors</h2>
    <md-list>
      <md-list-item v-for="error in errors" :key="errors.timestamp">
      {{pretty(error)}}
      </md-list-item>
    </md-list>

    <h2 v-if="locations.length">Recorded locations</h2>
    <md-list>
      <md-list-item v-for="location in locations" :key="location.timestamp">
        <md-icon>location_searching</md-icon>
        <span>pretty(location)</span>
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
        errors: [],
        locations: [],

        positionOptions: {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        },

        getting_position: false,
      }
    },
    computed: {
      location_msg() {
        return this.location_activity || 'No action'
      },
      location() {
        return this.locations[this.locations.length-1] || 'No location set'
      },
      location_activity() {
        return this.getting_position ? 'Getting current position' : ''
      },
    },
    created() {

    },
    methods: {
      get_current_position() {
        this.getting_position = true

        const start_stamp = moment()

        get_current_position(this.positionOptions)
          .then((position) => {
            this.getting_position = false

            const end_stamp = moment()
            const duration = this.get_duration(start_stamp, end_stamp)

            // Add additional properties
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
        position.username = this.$store.state.meta.user.username
        position.id = uuid()
        position.user_agent = navigator.userAgent

        return position
      },
      add_location(position) {
        this.locations.push(position)
      },

      // Formatting
      get_duration(start_stamp, end_stamp) {
        return moment.utc(moment(end_stamp,"DD/MM/YYYY HH:mm:ss").diff(moment(start_stamp,"DD/MM/YYYY HH:mm:ss"))).format("s")
      },
      human_time(timestamp) {
        return moment(timestamp).format('kk:mm:ss:SS ddd')
      },
      pretty(thing) {
        return JSON.stringify(thing, null, 2)
      },
    }
  }
</script>
