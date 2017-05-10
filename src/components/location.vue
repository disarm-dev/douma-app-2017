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
      <p>Some point thing</p>
    </div>

    <div v-if="type === 'structure'">
      <p>Structure is not supported yet.</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'location',
    data() {
      return {
        type: 'text',
      }
    },
    watch: {
      'type': 'update_location'
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