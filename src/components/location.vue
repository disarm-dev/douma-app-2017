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
      <span>Type: {{ type }}</span>
    </div>

    <div v-if="type === 'text'">
      <input @change="on_text_change" type="text" placeholder="Enter location">
    </div>

    <div v-if="type === 'structure'">
      <p>Structure is not supported yet.</p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        type: '',
      }
    },
    watch: {
      'type': 'do_something'
    },
    methods: {
      do_something() {
        switch (this.type) {
          case 'point':
            this.find_location()
            break;
        }
      },
      find_location() {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            
            let {latitude, longitude} = position.coords

            this.emit_location({
              type: 'point',
              point: {latitude, longitude}
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