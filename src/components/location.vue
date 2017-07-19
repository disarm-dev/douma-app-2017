<template>
  <div>
    <md-card-header>
      <div>1. Get GPS coordinates</div>
    </md-card-header>
    <md-button :disabled='hunting_location' class='md-raised md-primary' ref="update_location_button" @click.native="check_for_location">
      Get/Update point location
    </md-button>
    <md-button v-if='show_demo_location_button' class='md-warn' @click.native="add_demo_location">Use demo location</md-button>
    <p class='message'>{{location_message}}</p>
  </div>
</template>

<script>
  import convert from 'geoposition-to-object'

  export default {
    name: 'location',
    props: ['initial_location'],
    data() {
      return {
        hunting_location: false,
        location: null,
        location_message: '',
        show_demo_location_button: !DOUMA_PRODUCTION_MODE
      }
    },
    created() {
      if (this.initial_location && this.initial_location.hasOwnProperty('coords') && this.initial_location.coords.hasOwnProperty('accuracy')) {
        this.location = this.initial_location
        this.location_message = `${this.location.coords.latitude}, ${this.location.coords.longitude} (accuracy: ${this.location.coords.accuracy} m)`
        this.$emit('change', this.location)
      }
    },
    methods: {
      add_demo_location() {
        const map_focus = this.$store.state.instance_config.map_focus
        this.location = {
          coords: {
            latitude: map_focus.centre.lat + (Math.random()/100),
            longitude: map_focus.centre.lng + (Math.random()/100),
            accuracy: 150
          }
        }
        this.location_message = `${this.location.coords.latitude}, ${this.location.coords.longitude} (accuracy: ${this.location.coords.accuracy} m)`
        this.$emit('change', this.location)
      },
      check_for_location() {
        if ('geolocation' in navigator) {
          const options = {
            enableHighAccuracy: true,
            timeout: 5000
          }

          const success = (position) => {
            this.location = convert(position)
            this.location_message = `${this.location.coords.latitude}, ${this.location.coords.longitude} (accuracy: ${this.location.coords.accuracy} m)`
            this.hunting_location = false
            this.$emit('change', this.location)
          }

          const fail = (error) => {
            this.location_message = `Cannot get location, if it helps: code ${error.code} ${error.message}`
            this.hunting_location = false
            this.$emit('change', error)
          }

          this.hunting_location = true
          navigator.geolocation.getCurrentPosition(success, fail, options)
        }
      }
    }
  }
</script>

<style>
  .message {
    padding: 10px;
  }
</style>
