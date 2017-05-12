<template>
  <div class='container'>
    <h3>Debug location for {{country}} instance</h3>
    <md-input-container>
      <label>Waypoint ID</label>
      <md-input v-model="waypoint_id"></md-input>
    </md-input-container>
    <md-button @click.native="get_current_position" :disabled='getting_position'>Get current location</md-button>
    <md-checkbox v-model="enableHighAccuracy">High accuracy</md-checkbox>
    <md-button>Sync</md-button>
    <p>{{location_msg}}</p>

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
  import {get_current_position} from '../../../lib/location_helper.js'
  import moment from 'moment'
  import uuid from 'uuid/v4'

  export default {
    name: 'location_debug',
    data () {
      return {
        getting_position: false,
        enableHighAccuracy: false,
        location_activity: '',
        waypoint_id: ''
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
      country() {
        return this.$store.state.instance_config.slug
      },
      location_activity() {
        return this.getting_position ? 'Getting current position' : ''
      } 
    },
    methods: {
      human_time(timestamp) {
        return moment(timestamp).format('kk:mm:ss:SS ddd')
      },
      get_current_position() {
        this.getting_position = true


        const start_stamp = moment()
        const options = {enableHighAccuracy: this.enableHighAccuracy}

        get_current_position(options).then((position) => {

          this.getting_position = false

          const end_stamp = moment()
          const duration = this.get_duration(start_stamp, end_stamp)

          position = this.create_position_object(position, duration)
          this.add_location(position)
        })
      },
      create_position_object(position, duration) {
        position.duration = duration
        position.waypoint_id = this.waypoint_id
        position.username = this.$store.state.meta.user.username
        position.id = uuid()
        position.user_agent = navigator.userAgent
        position.synced = false

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
        this.locations
          .filter((location) => (
            !location.synced
          ))
          .map((location) => {
            fetch(`https://disarm-platform.firebaseio.com/locations/${location.id}.json`, {
              method: 'PUT',
              body: JSON.stringify(location)
            }).then(() => {
              location.synced = true
              this.$store.commit('meta/update_location', location)
            })
          })
      }
    }
  }
</script>

<style scoped>
  .container {
    margin: 10px;
  }
</style>
