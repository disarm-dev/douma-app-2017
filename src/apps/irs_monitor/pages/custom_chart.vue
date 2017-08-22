<template>
  <div :id="div_id"></div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: 'custom_chart',
    props: ['div_id', 'get_data', 'layout', 'responses'],
    computed: {
      ...mapState({
        aggregations: state => state.instance_config.aggregations
      })
    },
    watch: {
      'responses': 'render_chart'
    },
    mounted() {
      this.render_chart()
    },
    methods: {
      render_chart() {
        const data = this.get_data({responses: this.responses, denominators: [], aggregations: this.aggregations})

        // Plotly#newPlot can be called multiple times, will update data, but not layout
        Plotly.newPlot(this.div_id, data, this.layout, {displayModeBar: false})
      }
    }
  }
</script>

<style lang="css" scoped>
</style>
