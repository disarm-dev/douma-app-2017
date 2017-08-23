<template>
  <div :id="chart_id"></div>
</template>

<script>
  import {mapState} from 'vuex'

  import get_data from '../lib/get_data_for_viz'

  export default {
    name: 'custom_chart',
    props: ['chart_id', 'options', 'responses', 'targets'],
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
        const data = get_data({
          responses: this.responses,
          targets: this.targets,
          aggregations: this.aggregations,
          options: this.options
        })

        // Plotly#newPlot can be called multiple times, will update data, but not layout
        Plotly.newPlot(this.chart_id, data, this.options.layout, {displayModeBar: this.options.layout.displayModeBar || false})

      }
    }
  }
</script>

<style lang="css" scoped>
</style>
