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
    computed: {
      position_text() {
        if (this.position) {
          return `${this.position.coords.latitude}, ${this.position.coords.longitude} (accuracy: ${this.position.coords.accuracy} m)`
        }
      },
    },
    created() {
      if (this.existing_location) {
        this.position = this.existing_location
        this.$emit('position', this.position)
      }
    },
    mounted() {
    },
    methods: {
      check_for_location() {
        if ('geolocation' in navigator) {
          const options = {
            enableHighAccuracy: true,
            timeout: 5000
          }

          const success = (position) => {
            this.position = position
            this.location_message = this.position_text
            this.hunting_location = false
            this.$emit('position', convert(position))
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
