k<template>
  <div class='container'>
    <h1>IRS Dashboard</h1>

    <h2>Table and map update with real records</h2>
    <div>
      <md-card class="card">
        <md-card-content>
          <p>{{responses.length}} record{{responses.length === 1 ? '' : 's' }}</p>
          <md-button class="md-raised md-primary" @click.native="refresh_data" :disabled="loading">Refresh data</md-button>
        </md-card-content>
      </md-card>

      <md-card v-if='filters_on' class="card">
        <md-card-content>
          <filters v-on:filter="filter"></filters>
        </md-card-content>
      </md-card>

      <md-card class="card">
        <md-card-content>
          <map_progress :responses="responses" :denominator="denominator"></map_progress>
        </md-card-content>
      </md-card>

      <md-card class="card">
        <md-card-content>
          <table_progress :responses="responses" :denominator="denominator"></table_progress>
        </md-card-content>
      </md-card>

      <h2>Charts below use static data only</h2>
      <md-card v-for="component in components" :key="component.name" class="card" :ref="component.name" :class="{'card-half-width': component.width_constraint == 'half'}">
        <md-card-content>
          <component
            :is="component.name"
            :height="component.height_constraint == 'viewport' ? window_height : undefined"
            :responses='responses'
            :denominator='denominator'
            :component_config='component'
            ></component>
        </md-card-content>
      </md-card>
    </div>

  </div>
</template>

<script>
  import numeral from 'numeral'
  import moment from 'moment'
  import {mapState} from 'vuex'

  // Common components
  import Filters from './filters.vue'
  import basic_chart from './common/basic_chart.js'
  import line_chart from './common/line_chart.js'
  import table_progress from './common/table_progress.vue'
  import map_progress from './common/map.vue'

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
   import bwa_chart_prop_people_covered from './bwa/bwa_chart_prop_people_covered'
   import bwa_chart_refusal_pie from './bwa/bwa_chart_refusal_pie'

   // ZWE

   import zwe_chart_prop_room_sprayed from './zwe/zwe_chart_prop_room_sprayed'
   import zwe_chart_prop_people_covered from './zwe/zwe_chart_prop_people_covered'
   import zwe_chart_refusal_pie from './zwe/zwe_chart_refusal_pie'

  export default {
    name: 'MonitorDashboard',
    components: {
      // Common
      Filters,
      basic_chart,
      line_chart,
      table_progress,
      map_progress,

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
      bwa_chart_prop_people_covered,
      bwa_chart_refusal_pie,

      // ZWE
      zwe_chart_prop_room_sprayed,
      zwe_chart_prop_people_covered,
      zwe_chart_refusal_pie

    },
    filters: {
      two_decimals(value) {
        return numeral(value).format('0.[00]')
      }
    },
    data () {
      return {
        loading: false,

        // Debug
        filters_on: false,
        denominator: {population: 500, structures_targeted: 150},
      }
    },
    computed: {
      ...mapState({
        slug: state => state.instance_config.slug,
        country: state => state.instance_config.name,
        components: state => state.instance_config.applets.irs_monitor.components,
        online: state => state.network_online,
        responses: state => state.irs_monitor.responses
      }),
      window_height() {
        return (window.innerHeight - 64) - 200
      },
    },
    created() {
    },
    methods: {
//      filter(filter) {
//        if (filter.value === 'all') {
//          this.$store.commit('irs_monitor/remove_filter', filter.type)
//        } else {
//          this.$store.commit('irs_monitor/toggle_filter', filter)
//        }
//      },
      refresh_data() {
        this.loading = true
        this.$store.commit('root:set_loading', true)

        Promise.all([this.$store.dispatch('irs_monitor/get_all_records'), this.$store.dispatch('irs_monitor/get_current_plan')])
          .then(() => {
            this.loading = false
            this.$store.commit('root:set_loading', false)
            this.$store.commit('root:set_snackbar', {message: 'Successfully retrieved records'})
          })
          .catch(e => {
            console.log(e)
            this.loading = false
            this.$store.commit('root:set_loading', false)
          })
      },
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
