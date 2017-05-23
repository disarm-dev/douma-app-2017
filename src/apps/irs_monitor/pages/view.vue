<template>
  <div>
    <h1>DASHBOARD: {{country}}</h1>
    <div class='container'>

      <md-card class="card" >
        <md-card-content>
          <div><h1>Filters</h1></div>
        </md-card-content>
      </md-card>

      <template v-for="{name, width_constraint, height_constraint} in components" >
        <md-card class="card" :ref="name" :class="{'card-half-width': width_constraint == 'half'}">
          <md-card-content>
            <component :is="name" :height="height_constraint == 'viewport' ? window_height : undefined"></component>
          </md-card-content>
        </md-card>
      </template>

    </div>
  </div>
</template>

<script>
  import numeral from 'numeral'

  // Common components
  import basic_chart from './common/basic_chart.js'
  import line_chart from './common/line_chart.js'
  import table_progress from './common/table_progress.vue'

  // SWZ
  import swz_chart_pop_covered from './swz/swz_chart_pop_covered'
  import swz_chart_structures_sprayed from './swz/swz_chart_structures_sprayed'
  import swz_chart_locked_vs_sprayed from './swz/swz_chart_locked_vs_sprayed'
  import swz_chart_pop_covered_vs_structures from './swz/swz_chart_pop_covered_vs_structures'
  import swz_chart_structures_pr_supervisor from './swz/swz_chart_structures_pr_supervisor'
  import swz_map_progress_locations from './swz/swz_map_progress_locations'

  // NAM
  import nam_chart_structures_sprayed_doughnut from './nam/nam_chart_structures_sprayed_doughnut'
  import nam_map_progress_locations from './nam/nam_map_progress_locations'

  // BWA
  import bwa_chart_prop_room_sprayed from './bwa/bwa_chart_prop_room_sprayed'
  import bwa_chart_prop_people_covered from './bwa/bwa_chart_prop_people_covered'
  import bwa_chart_refusal_pie from './bwa/bwa_chart_refusal_pie'
  import bwa_map_progress_locations from './bwa/bwa_map_progress_locations'


  import seed_data from '@/../seed_data/index.js'


  export default {
    name: 'NotADashboardDashboard',
    components: {
      // Common
      basic_chart,
      line_chart,
      table_progress,

      // SWZ
      swz_chart_pop_covered,
      swz_chart_structures_sprayed,
      swz_chart_locked_vs_sprayed,
      swz_chart_pop_covered_vs_structures,
      swz_chart_structures_pr_supervisor,
      swz_map_progress_locations,

      // NAM
      nam_chart_structures_sprayed_doughnut,
      nam_map_progress_locations,

      // BWA
      bwa_chart_prop_room_sprayed,
      bwa_chart_prop_people_covered,
      bwa_chart_refusal_pie,
      bwa_map_progress_locations

    },
    filters: {
      two_decimals(value) {
        return numeral(value).format('0.[00]')
      }
    },
    data () {
      return {
        responses: [],
        denominator: []
      }
    },
    created() {
    },
    mounted() {
      this.responses = seed_data[this.slug].responses
      this.denominator = seed_data[this.slug].denominator
    },
    computed: {
      window_height() {
        return (window.innerHeight - 64) - 200
      },
      slug() {
        return this.$store.state.instance_config.slug.toLowerCase()
      },
      country() {
        return this.$store.state.instance_config.name
      },
      components() {
        return this.$store.state.instance_config.applets.irs_monitor.components
      }
    },
    methods: {
    }
  }
</script>

<style scoped>
  .container {
    margin: 1em auto;
    width: 90%;
  }

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
