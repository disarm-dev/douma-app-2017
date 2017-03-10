<template>
  <div>
    <div class="container">
      <h3>Weather data for Zimbabwe</h3>
      <div class='slider-bar'>
        <md-button-toggle md-single>
          <md-button 
            v-for='(layer, index) in layers' 
            @click.native='select_layer(layer)'>
            {{layer.title}}
          </md-button>

          <md-button 
            @click.native='select_layer(null)'
            class='md-accent md-toggle'>
            None
          </md-button>
        </md-button-toggle>

        <vue-slider class='date-slider' v-bind="slider" ref="slider" v-model="date"></vue-slider>
      </div>
    </div>

    <climate-map :layer='layer' :date='date'></climate-map>

  </div>
</template>

<script>
  import ClimateMap from './map.vue'
  import vueSlider from 'vue-slider-component'

  export default {
    name: 'ClimateView',
    components: {ClimateMap, vueSlider},
    watch: {
      'date': 'select_date'
    },
    data () {
      return {
        date: "2016-10-01",
        slider: {
          // piecewise: true,
          tooltipDir: "bottom",
          style: {
            "margin": "0 10% 50px"
          },
          data: [
            "2016-10-01",
            "2016-10-02",
            "2016-10-03",
            "2016-10-04",
            "2016-10-05",
            "2016-10-06",
            "2016-10-07"
          ],
        }
      }
    },
    computed: {
      layers() {
        return this.$store.state.climate.layers
      },
      layer() {
        return this.$store.state.climate.selected_layer
      }
    },
    methods: {
      select_layer(layer){
        this.$store.commit('climate:select_layer', layer)
      },
      select_date() {
        this.$store.commit('climate:select_date', this.date)
      }
    }

  }
</script>

<style scoped>
  .container {
    margin: 10;
  }

  .date-slider {
    margin-top: 30px;
    height: 20px;
  }
</style>