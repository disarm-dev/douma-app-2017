<template>
  <div>
    <h2>Charts below use static data only</h2>

    <md-card
      v-for="component in chart_configs"
      :key="component.name"
      class="card"
      :class="{'card-half-width': component.width_constraint == 'half'}">

      <md-card-content>

        <custom_chart
          :responses="responses"
          :div_id="component.name"
          :options="component.options"
          :layout="component.layout"
          :get_data="charts[component.name].get_data"
          :series="charts[component.series]"
        >

        </custom_chart>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import custom_chart from './custom_chart.vue'

  export default {
    name: 'custom-charts',
    components: {
      custom_chart,
    },
    data() {
      return {
        charts: {}
      }
    },
    created() {
      this.charts = instance_charts[this.slug]
    },
    computed: {
      ...mapState({
        responses: state => state.irs_monitor.responses,
        slug: state => state.instance_config.instance.slug,
        chart_configs: state => state.instance_config.applets.irs_monitor.components,
      })
    }
  }
</script>

<style scoped>
  .card {
    display: inline-block;
    margin: 2.5%;
    padding: 1em;
    flex: 1;
    width: 95%;
  }

  .card-half-width {
    width: 45%;
  }
</style>
