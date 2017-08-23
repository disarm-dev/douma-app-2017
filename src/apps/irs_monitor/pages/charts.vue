<template>
  <div>
    <md-card
      v-for="chart in chart_configs"
      :key="chart.id"
      class="card"
      :class="{'card-half-width': chart.style.width_constraint == 'half'}">

      <md-card-content>

        <custom_chart
          :chart_id="chart.id"
          :get_data="get_data_functions[chart.type]"
          :options="chart.options"
          :responses="responses"
          :targets="targets"
        >
        </custom_chart>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import custom_chart from './chart.vue'
  import get_data_functions from './viz_data'

  export default {
    name: 'custom-charts',
    props: ['responses', 'targets'],
    components: {custom_chart},
    data() {
      return {
        get_data_functions
      }
    },
    computed: {
      ...mapState({
        chart_configs: state => state.instance_config.applets.irs_monitor.charts,
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
