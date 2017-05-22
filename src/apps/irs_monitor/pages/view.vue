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
  import Translations from '@/lib/translations'

  // Common components
  import basic_chart from './common/basic_chart.js'
  import line_chart from './common/line_chart.js'

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
  import nam_table_progress from './nam/nam_table_progress'

  // BWA
  import bwa_chart_prop_room_sprayed from './bwa/bwa_chart_prop_room_sprayed'
  import bwa_chart_prop_people_covered from './bwa/bwa_chart_prop_people_covered'
  import bwa_chart_refusal_pie from './bwa/bwa_chart_refusal_pie'
  import bwa_map_progress_locations from './bwa/bwa_map_progress_locations'


  export default {
    name: 'NotADashboardDashboard',
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
      swz_map_progress_locations,

      // NAM
      nam_chart_structures_sprayed_doughnut,
      nam_map_progress_locations,
      nam_table_progress,

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
        t: {}, // TRANSLATIONS,
        denominator: 123,
        _components: []
      }
    },
    created() {
      this.add_translations()
    },
    mounted() {
      console.warn("IRS Monitor: Loaded SEED data for debugging")
    },
    computed: {
      window_height() {
        return (window.innerHeight - document.querySelector('.md-toolbar').clientHeight) - 200
      },
      slug() {
        return this.$store.state.instance_config.slug
      },
      country() {
        return this.$store.state.instance_config.name
      },
      components() {
        return this.$store.state.instance_config.applets.irs_monitor.components
      }
    },
    methods: {
      add_translations() {
        const Translator = Translations[this.slug.toLowerCase()]
        const options = {
          targeted_count: this.fake_denominator
        }
        const responses = this.$store.state.irs_monitor.responses
        const translations = new Translator({responses, options})
        this.t = translations
      }
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
