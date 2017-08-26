<template>
  <div :id="chart_id"></div>
</template>

<script>
  import Plotly from 'plotly.js/dist/plotly-basic.js'
  import get_data from '../../lib/get_data_for_viz'

  const plotly_event_listeners = []

  export default {
    name: 'custom_chart',
    props: ['chart_id', 'responses', 'targets', 'aggregations', 'options'],
    watch: {
      'responses': 'render_chart',
      'options': 'render_chart'
    },
    mounted() {
      this.render_chart()
    },
    beforeDestroy() {
      for(let fn of plotly_event_listeners) {
        window.removeEventListener('resize', fn)
        plotly_event_listeners.splice(0, 1)
      }
    },
    methods: {
      render_chart() {
        if (!this.responses.length) return
        if (this.options.fake_data) console.warn("Using fake data")
        const data = this.options.fake_data || get_data({
          responses: this.responses,
          targets: this.targets,
          aggregations: this.aggregations,
          options: this.options
        })

        const layout_defaults = {
          legend: {"xanchor": "right", bgcolor: 'rgba(234, 234, 234, 0.79)'}
        }

        const layout = {...layout_defaults, ...this.options.layout}

        // Plotly#newPlot can be called multiple times, will update data, but not layout
        Plotly.newPlot(this.chart_id, data, layout, {displayModeBar: this.options.layout.displayModeBar || false}).then((plot) => {
          const fn = Plotly.Plots.resize.bind(this, plot)
          window.addEventListener('resize', fn, {passive: true})
          plotly_event_listeners.push(fn)
        })

      }
    }
  }
</script>

<style lang="css" scoped>
</style>
