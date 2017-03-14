<template>
  <div>
    <div class="container">
      <h3>Weather data for Zimbabwe</h3>
      <div class='slider-bar'>
        <md-button-toggle md-single>
          <md-button 
            @click.native='select_layer(null)'
            class='md-accent md-toggle'>
            None
          </md-button>

          <md-button 
            v-for='(layer, index) in layers' 
            @click.native='select_layer(layer)'>
            {{layer.title}}
          </md-button>

        </md-button-toggle>

        <vue-slider class='date-slider' v-bind="slider" ref="slider" v-model="date"></vue-slider>

        <md-button @click.native="move_date('backward')" :disabled='this.date === this.earliest_date' class="md-icon-button">
          <md-icon>navigate_before</md-icon>
        </md-button>

        <md-button @click.native="move_date('forward')" :disabled='this.date === this.latest_date' class="md-icon-button">
          <md-icon>navigate_next</md-icon>
        </md-button>
      </div>
    </div>

    <climate-map :layer='layer' :date='date' :country="country"></climate-map>

  </div>
</template>

<script>
  import ClimateMap from './map.vue'
  import vueSlider from 'vue-slider-component'
  import moment from 'moment'

  export default {
    name: 'ClimateView',
    components: {ClimateMap, vueSlider},
    watch: {
      'date': 'select_date'
    },
    created() {
      this.config_slider()
    },
    data () {
      return {
        earliest_date: '2015-01-01',
        latest_date: '2017-03-01',
        date: null,
        slider: {
          // piecewise: true,
          tooltipDir: "bottom",
          style: {
            "margin": "0 10% 50px"
          },
          data: []
        }
      }
    },
    computed: {
      layers() {
        return this.$store.state.climate.layers
      },
      layer() {
        return this.$store.state.climate.selected_layer
      },
      dates_for_slider() {
        let task_date = moment(this.earliest_date).clone()
        const latest_date = moment(this.latest_date)

        let dates = []
        while (task_date <= latest_date) {
          dates.push(task_date.format("YYYY-MM-DD"))
          task_date.add(1, 'M')
        }
        return dates
      },
      country() {
        return this.$store.state.climate.country
      }
    },
    methods: {
      select_layer(layer){
        this.$store.commit('climate:select_layer', layer)
      },
      select_date() {
        this.$store.commit('climate:select_date', this.date)
      },
      move_date(direction) {
        let target_date = moment(this.date).clone()
        if (direction == 'forward') {
          target_date.add(1, 'M')
        } else {
          target_date.subtract(1, 'M')
        }
        this.date = target_date.format("YYYY-MM-DD")
      },
      config_slider() {
        this.slider.data = this.dates_for_slider
        this.date = this.slider.data[this.slider.data.length - 1]
      },
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