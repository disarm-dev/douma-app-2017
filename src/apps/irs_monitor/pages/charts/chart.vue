<template>
  <div>

    <md-card-header>
      <div class="md-subheading">
        <b>{{options.layout.title}}</b>
      </div>
    </md-card-header>

    <div :id="chart_id"></div>

    <md-card-content v-if="!responses.length">
      <div><em>Not enough data to display chart (and who likes empty charts anyway?)</em></div>
    </md-card-content>

  </div>
</template>

<script>
  import Plotly from 'plotly.js/dist/plotly-basic.js'
  import get_data from '../../lib/get_data_for_viz'
  import cache from 'config/cache'

  const plotly_event_listeners = []

  export default {
    name: 'custom_chart',
    props: ['chart_id', 'responses', 'targets', 'aggregations', 'options'],
    watch: {
      'responses': 'render_chart',
    },
    data() {
      return {
        _chart: null
      }
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
        // If no responses and chart previously rendered, then remove it and return
        // Do these checks to avoid rendering whole chart if data has changed
        if (!this.responses.length) {
          if (this._chart) Plotly.purge(this._chart)
          return
        }

        const geodata = cache.geodata // TODO: @refac When we fix geodata into store, etc

        const data = get_data({
          responses: this.responses,
          targets: this.targets,
          aggregations: this.aggregations,
          options: this.options,
          geodata: geodata
        })

        const layout_defaults = {
          legend: {"xanchor": "right", bgcolor: 'rgba(234, 234, 234, 0.79)'}
        }

        const layout = {...layout_defaults, ...this.options.layout}

        delete layout.title

        // Plotly#newPlot can be called multiple times, will update data, but not layout
        Plotly.newPlot(this.chart_id, data, layout, {displayModeBar: this.options.layout.displayModeBar || false})
          .then((plot) => {
            this._chart = plot
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
