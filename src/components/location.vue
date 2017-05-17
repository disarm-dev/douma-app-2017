<template>
  <div>
    <!--<md-button ref="update_location_button" @click.native="update_point_location">Update point location</md-button>-->
    <md-input-container v-show='location_mode === "text"'>
      <md-input type='text'></md-input>
    </md-input-container>
    <p v-show="position">{{position_text}}</p>
    <!--<md-button v-show="location_mode === 'text'">Save location</md-button>-->
  </div>
</template>

<script>
  export default {
    name: 'location',
    props: ['existing_location'],
    data() {
      return {
        location_mode: "point",
        position: null
      }
    },
    computed: {
      position_text() {
        if (this.position) {
          return "found position"
        }
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
          this.position = position
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
