<template>
  <div>
    <h2>Charts below use static data only</h2>

    <md-card
      v-for="component in instance_components"
      :key="component.name"
      class="card"
      :class="{'card-half-width': component.width_constraint == 'half'}">

      <md-card-content>

        <custom_chart 
          :div_id="component.name" 
          :get_data="charts[component.name].get_data" 
          :get_layout="charts[component.name].get_layout"
        >
          
        </custom_chart>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import custom_chart from './common/custom_chart.vue'

  // ZWE
  import zwe from './zwe'

  const instance_charts = {
    zwe
  }

  export default {
    name: 'custom-charts',
    components: {
      custom_chart,
    },
    props: ['aggregated_responses', 'filtered_responses'],
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
        slug: state => state.instance_config.instance.slug,
        instance_components: state => state.instance_config.applets.irs_monitor.components,
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
