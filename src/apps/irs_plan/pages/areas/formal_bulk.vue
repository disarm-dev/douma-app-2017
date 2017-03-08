<template>
  <div>
    <p>Select risk level on slider</p>
    <vue-slider v-bind="slider_options" v-model="risk_slider_value" ref='slider'></vue-slider>
  </div>
</template>

<script>
  import vueSlider from 'vue-slider-component'

  export default {
    name: 'FormalBulk',
    components: {vueSlider},
    props: ['formal_areas', 'show_preview'],
    data () {
      return {
        risk_slider_value: 0,
        slider_options: {
          min: 0,
          max: 100,
          interval: 1,
          lazy: true,
          tooltipDir: 'bottom'
          // tooltip: 'always',
          // formatter: '{value} local areas'
        }
      }
    }
  }
</script>

<style lang="css" scoped>
</style>