<template>
  <div>
    <md-card-header>
      <div>Get GPS coordinates *</div>
    </md-card-header>
    <md-button :disabled='hunting_location' class='md-raised md-primary' ref="update_location_button" @click.native="check_for_location">
      Get/Update point location
    </md-button>
    <md-button v-if='show_demo_location_button' class='md-warn' @click.native="add_demo_location">Use demo location</md-button>
    <p class='message'>{{coords_message}}</p>
  </div>
</template>

<script>
  import convert from 'geoposition-to-object'

  export default {
    name: 'location_coords',
    props: ['initial_location'],
    data() {
      return {
        hunting_location: false,
        coords: null,
        coords_message: '',
        show_demo_location_button: !DOUMA_PRODUCTION_MODE
      }
    },
    created() {
      if (this.initial_location  && this.initial_location.hasOwnProperty('accuracy')) {
        this.coords = this.initial_location
        this.coords_message = `${this.coords.latitude}, ${this.coords.longitude} (accuracy: ${this.coords.accuracy} m)`
        this.$emit('change', this.coords)
      }
    },
    methods: {
      add_demo_location() {
        const map_focus = this.$store.state.instance_config.map_focus
        this.coords = {
          latitude: map_focus.centre.lat + (Math.random()/100),
          longitude: map_focus.centre.lng + (Math.random()/100),
          accuracy: 150
        }
        this.coords_message = `${this.coords.latitude}, ${this.coords.longitude} (accuracy: ${this.coords.accuracy} m)`
        this.$emit('change', this.coords)
      },
      check_for_location() {
        if ('geolocation' in navigator) {
          const options = {
            enableHighAccuracy: true,
            timeout: 5000
          }

          const success = (position) => {
            let {coords} = convert(position) // returns {coords, timestamp}
            this.coords = coords
            this.coords_message = `${this.coords.latitude}, ${this.coords.longitude} (accuracy: ${this.coords.accuracy} m)`
            this.hunting_location = false
            this.$emit('change', this.coords)
          }

          const fail = (error) => {
            this.coords_message = `Cannot get location, if it helps: code ${error.code} ${error.message}`
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
