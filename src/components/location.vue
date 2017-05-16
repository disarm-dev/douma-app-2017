<template>
  <div>
    <p>{{location_message}}</p>
    <md-button>Update point location</md-button>
    <input v-show='point_failed' type='text'/>
  </div>
</template>

<script>
  export default {
    name: 'location',
    props: ['existing_location'],
    data() {
      return {
        location_message: 'No geolocation activity',
        point_failed: false
      }
    },
    mounted() {
      this.find_location()
      // if (this.existing_location) {
      //   this.emit_location(this.existing_location)
      // }
    },
    methods: {
      find_location() {
        console.log('start finding location')
        // if ("geolocation" in navigator) {
        //   this.location_message = 'Hunting...'
        //   navigator.geolocation.getCurrentPosition((position) => {
            
        //     let {latitude, longitude, accuracy} = position.coords
        //     accuracy = accuracy / 2
        //     this.location_message = `Found: ${latitude} ${longitude} (accurate +/- ${accuracy}m)`

        //     this.emit_location({
        //       type: 'point',
        //       point: {latitude, longitude, accuracy}
        //     })
        //   });
        // } else {
        //   // TODO @refac Handle the case where geolocation api is not available
        // }
      },
      emit_location(value) {
        this.$emit('change', value)
      }
    }
  }  
</script>

<style>
  
</style>