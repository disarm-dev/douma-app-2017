<template>
  <div>
    <h2>Charts below use static data only</h2>

    <md-card
      v-for="component in components"
      :key="component.name"
      class="card"
      :ref="component.name"
      :class="{'card-half-width': component.width_constraint == 'half'}">

      <md-card-content>
        <component
          :is="component.name"
          :height="component.height_constraint == 'viewport' ? window_height : undefined"
          :responses='aggregated_responses'
          :denominator="{}"
          :component_config='component'>
        </component>

      </md-card-content>
    </md-card>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import basic_chart from './common/basic_chart.js'
  import line_chart from './common/line_chart.js'

  // SWZ
  import swz_chart_pop_covered from './swz/swz_chart_pop_covered'
  import swz_chart_structures_sprayed from './swz/swz_chart_structures_sprayed'
  import swz_chart_locked_vs_sprayed from './swz/swz_chart_locked_vs_sprayed'
  import swz_chart_pop_covered_vs_structures from './swz/swz_chart_pop_covered_vs_structures'
  import swz_chart_structures_pr_supervisor from './swz/swz_chart_structures_pr_supervisor'

  // NAM
  import nam_chart_structures_sprayed_doughnut from './nam/nam_chart_structures_sprayed_doughnut'

  // BWA
  import bwa_chart_prop_room_sprayed from './bwa/bwa_chart_prop_room_sprayed'
  import bwa_chart_refusal_pie from './bwa/bwa_chart_refusal_pie'
  import bwa_rooms_sprayed_per_week from './bwa/bwa_rooms_sprayed_per_week'
  import bwa_table from './bwa/bwa_table'

  // ZWE
  import zwe_chart_prop_room_sprayed from './zwe/zwe_chart_prop_room_sprayed'
  import zwe_chart_prop_people_covered from './zwe/zwe_chart_prop_people_covered'
  import zwe_chart_refusal_pie from './zwe/zwe_chart_refusal_pie'


  export default {
    name: 'custom-charts',
    components: {
      // Common
      basic_chart,
      line_chart,

      // SWZ
      swz_chart_pop_covered,
      swz_chart_structures_sprayed,
      swz_chart_locked_vs_sprayed,
      swz_chart_pop_covered_vs_structures,
      swz_chart_structures_pr_supervisor,

      // NAM
      nam_chart_structures_sprayed_doughnut,

      // BWA
      bwa_chart_prop_room_sprayed,
      bwa_chart_refusal_pie,
      bwa_rooms_sprayed_per_week,
      bwa_table,

      // ZWE
      zwe_chart_prop_room_sprayed,
      zwe_chart_prop_people_covered,
      zwe_chart_refusal_pie
    },
    props: ['aggregated_responses', 'filtered_responses'],
    mounted() {
    },
    data() {
      return {}
    },
    computed: {
      ...mapState({
        components: state => state.instance_config.applets.irs_monitor.components,
      }),
      window_height() {
        return (window.innerHeight - 64) - 200
      },
    },
    methods: {}
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
