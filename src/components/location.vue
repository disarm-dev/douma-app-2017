<template>
  <div>
    <md-button>Update point location</md-button>
    <input v-show='location_mode == "text"' type='text'/>
  </div>
</template>

<script>
  export default {
    name: 'location',
    props: ['existing_location'],
    data() {
      return {
        location_mode: "point"
      }
    },
    mounted() {
      if ('geolocation' in navigator) {
        this.find_location()
      } else {
        this.location_mode = "text"
      }
    },
    methods: {
      find_location() {
        navigator.geolocation.getCurrentPosition((position) => {

//         let {latitude, longitude, accuracy} = position.coords
//         accuracy = accuracy / 2
//         this.location_message = `Found: ${latitude} ${longitude} (accurate +/- ${accuracy}m)`

//         this.emit_location({
//           type: 'point',
//           point: {latitude, longitude, accuracy}
//         })
        });
      },
//      emit_location(value) {
//        this.$emit('change', value)
//      }
    }
  }
</script>

<style>

</style>
