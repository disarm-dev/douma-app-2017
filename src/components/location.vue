<template>
  <div>
    <md-button :disabled='hunting_location' class='md-raised md-primary' ref="update_location_button" @click.native="check_for_location">
      Get/Update point location
    </md-button>
    <p class='message'>{{location_message}}</p>
  </div>
</template>

<script>
  import convert from 'geoposition-to-object'

  export default {
    name: 'location',
    props: ['existing_location'],
    data() {
      return {
        hunting_location: false,
        location: null,
        location_message: ''
      }
    },
    created() {
      if (this.existing_location) {
        this.location = this.existing_location
        this.location_message = `${this.location.coords.latitude}, ${this.location.coords.longitude} (accuracy: ${this.location.coords.accuracy} m)`
        this.$emit('position', this.location)
      }
    },
    methods: {
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
            this.$emit('position', this.location)
          }

          const fail = (error) => {
            this.location_message = `Cannot get location, if it helps: code ${error.code} ${error.message}`
            this.hunting_location = false
            this.$emit('position', error)
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
