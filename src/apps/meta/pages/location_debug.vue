<template>
  <div class='container'>
    <h3>Debug location for {{country}} instance</h3>
    <md-button @click.native="get_current_position">Get current location</md-button>
    <p>{{location_msg}}</p>
    <md-list>
      <md-list-item v-for="location in locations" :key="location.timestamp">
        <md-icon>location_searching</md-icon>
        <span>{{ human_time(location.timestamp) }} ({{location.coords.accuracy}}m, {{location.duration}}s)</span>

        <md-list-expand>
          <p>{{location}}</p>
        </md-list-expand>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
  import {get_current_position} from '../../../lib/location_helper.js'
  import moment from 'moment'

  export default {
    name: 'location_debug',
    data () {
      return {
        location_activity: '',
        locations: [],
      }
    },
    computed: {
      location_msg() {
        return this.location_activity || 'No action'
      },
      location() {
        return this.locations[this.locations.length-1] || 'No location set'
      },
      country() {
        return this.$store.state.instance_config.slug
      },
    },
    methods: {
      human_time(timestamp) {
        return moment(timestamp).format('kk:mm:ss:SS ddd')
      },
      get_current_position() {
        this.location_activity = 'Getting current position'
        const start_stamp = moment()
        get_current_position().then((position) => {
          this.location_activity = ''
          const end_stamp = moment()
          const duration = this.get_duration(start_stamp, end_stamp)
          position.duration = duration
          this.add_location(position)
        })
      },
      add_location(position) {
        if (this.locations.length === 0) {
          this.locations = [position]
        } else {
          this.locations.push(position)
        }
      },
      get_duration(start_stamp, end_stamp) {
        return moment.utc(moment(end_stamp,"DD/MM/YYYY HH:mm:ss").diff(moment(start_stamp,"DD/MM/YYYY HH:mm:ss"))).format("s")
      }
    }
  }
</script>

<style scoped>
  .container {
    margin: 10px;
  }
</style>
