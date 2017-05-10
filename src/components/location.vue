<template>
  <div>
    <div>
      <input type="radio" id="one" value="text" v-model="type">
      <label for="one">Text</label>
      <br>
      <input type="radio" id="two" value="point" v-model="type">
      <label for="two">Point</label>
      <br>
      <input type="radio" id="three" value="structure" v-model="type">
      <label for="three">Structure</label>
      <br>
    </div>

    <div v-show="type === 'text'">
      <p><input @change="on_text_change" type="text" placeholder="Enter location"></p>
    </div>

    <div v-show="type === 'point'">
      <p>{{location_message}}</p>
    </div>

    <div v-if="type === 'structure'">
      <p>Structure is not supported yet.</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'location',
    props: ['existing_location'],
    data() {
      return {
        type: 'text',
        location_message: 'Nothing'
      }
    },
    watch: {
      'type': 'update_location'
    },
    mounted() {
      if (this.existing_location) {
        this.emit_location(this.existing_location)
      }
    },
    methods: {
      update_location() {
        switch (this.type) {
          case 'point':
            this.find_location()
            break;
        }
      },
      find_location() {
        if ("geolocation" in navigator) {
          this.location_message = 'Hunting...'
          navigator.geolocation.getCurrentPosition((position) => {
            
            let {latitude, longitude, accuracy} = position.coords
            accuracy = accuracy / 2
            this.location_message = `Found: ${latitude} ${longitude} (accurate +/- ${accuracy}m)`

            this.emit_location({
              type: 'point',
              point: {latitude, longitude, accuracy}
            })
          });
        } else {
          // TODO @refac Handle the case where geolocation api is not available
        }
      },

      on_text_change(e) {
        this.emit_location({
          type: 'text',
          text: e.target.value
        })
      },

      emit_location(val) {
        this.$emit('change', val)
      }
    }
  }  
</script>

<style>
  
</style>