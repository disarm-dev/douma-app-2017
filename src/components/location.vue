<template>
  <div>
    <md-button class='md-raised md-primary' ref="update_location_button" @click.native="update_point_location">Get/Update point location</md-button>
    <p>{{location_message}}</p>
  </div>
</template>

<script>
  import convert from 'geoposition-to-object'

  export default {
    name: 'location',
    props: ['existing_location'],
    data() {
      return {
        location_mode: "point",
        position: null,
        location_message: 'e.g. FOUND LOCATION 24, 45 (accuracy 20)'
      }
    },
    computed: {
      position_text() {
        if (this.position) {
          return `${this.position.coords.latitude}, ${this.position.coords.longitude}`
        }
      },
    },
    mounted() {
      if (this.existing_location) {
        this.position = this.existing_location
        this.$emit('position', this.position)
      } else {
        this.check_for_location()
      }
    },
    methods: {
      check_for_location() {
        if ('geolocation' in navigator) {
          this.find_location()
        } else {
          this.location_mode = "text"
        }
      },
      find_location() {
        navigator.geolocation.getCurrentPosition((position) => {
          this.position = position
          this.$emit('position', convert(position))
        });
      }
    }
  }
</script>

<style>

</style>
