<template>
  <div id="map"></div>
</template>

<script>
  //import { mapState, mapActions, mapMutations } from 'vuex'
  import {basic_map} from 'lib/basic_map.js'

  export default {
    name: 'tasker-map',
    props: ['assignments'],
    watch: {'assignments': 'redraw_assignments'},
    mounted() {
      this.create_map()
    },
    methods: {
      create_map() {
        this._map = basic_map(this.$store)

        this._map.on('load', () => {
          this.load_data().then(() => {
            this.draw_areas()
            this.bind_click_handler()
            this.add_draw_controls()
          })
        })
      },
      redraw_assignments() {}
    }
  }
</script>

<style scoped>

</style>
