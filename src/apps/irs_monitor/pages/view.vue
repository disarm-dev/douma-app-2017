k<template>
  <div class='container'>
    <h1>IRS Dashboard</h1>

    <div v-if="online">
      <md-card class="card">
        <md-card-content>
          <p>{{actual_responses.length}} record{{actual_responses.length === 1 ? '' : 's' }}</p>
          <md-button class="md-raised md-primary" @click.native="refresh_responses" :disabled="loading">Refresh data</md-button>
        </md-card-content>
      </md-card>

      <md-card v-if='filters_on' class="card">
        <md-card-content>
          <filters v-on:filter="filter"></filters>
        </md-card-content>
      </md-card>

      <md-card class="card">
        <md-card-content>
          <table_progress :responses="responses" :denominator="denominator"></table_progress>
        </md-card-content>
      </md-card>

      <md-card class="card">
        <md-card-content>
          <map_progress :responses="responses" :denominator="denominator"></map_progress>
        </md-card-content>
      </md-card>

      <!-- <md-card v-for="component in components" :key="component.name" class="card" :ref="component.name" :class="{'card-half-width': component.width_constraint == 'half'}">
        <md-card-content>
          <component
            :is="component.name"
            :height="component.height_constraint == 'viewport' ? window_height : undefined"
            :responses='responses'
            :denominator='denominator'
            :component_config='component'
            ></component>
        </md-card-content>
      </md-card> -->
    </div>

    <div v-else>
      <h3>Monitor only available with a network connection.</h3>
    </div>
  </div>
</template>

<script>
  import numeral from 'numeral'
  import moment from 'moment'
  import {mapState} from 'vuex'

  // Common components
  import Filters from './filters.vue'
  // import basic_chart from './common/basic_chart.js'
  // import line_chart from './common/line_chart.js'
  import table_progress from './common/table_progress.vue'
  import map_progress from './common/map.vue'

  // SWZ
  // import swz_chart_pop_covered from './swz/swz_chart_pop_covered'
  // import swz_chart_structures_sprayed from './swz/swz_chart_structures_sprayed'
  // import swz_chart_locked_vs_sprayed from './swz/swz_chart_locked_vs_sprayed'
  // import swz_chart_pop_covered_vs_structures from './swz/swz_chart_pop_covered_vs_structures'
  // import swz_chart_structures_pr_supervisor from './swz/swz_chart_structures_pr_supervisor'
  // import swz_map_progress_locations from './swz/swz_map_progress_locations'

  // // NAM
  // import nam_chart_structures_sprayed_doughnut from './nam/nam_chart_structures_sprayed_doughnut'
  // import nam_map_progress_locations from './nam/nam_map_progress_locations'

  // // BWA
  // import bwa_chart_prop_room_sprayed from './bwa/bwa_chart_prop_room_sprayed'
  // import bwa_chart_prop_people_covered from './bwa/bwa_chart_prop_people_covered'
  // import bwa_chart_refusal_pie from './bwa/bwa_chart_refusal_pie'
  // import bwa_map_progress_locations from './bwa/bwa_map_progress_locations'

  export default {
    name: 'MonitorDashboard',
    components: {
      // Common
      Filters,
      // basic_chart,
      // line_chart,
      table_progress,
      map_progress

      // SWZ
      // swz_chart_pop_covered,
      // swz_chart_structures_sprayed,
      // swz_chart_locked_vs_sprayed,
      // swz_chart_pop_covered_vs_structures,
      // swz_chart_structures_pr_supervisor,
      // swz_map_progress_locations,

      // // NAM
      // nam_chart_structures_sprayed_doughnut,
      // nam_map_progress_locations,

      // // BWA
      // bwa_chart_prop_room_sprayed,
      // bwa_chart_prop_people_covered,
      // bwa_chart_refusal_pie,
      // bwa_map_progress_locations

    },
    filters: {
      two_decimals(value) {
        return numeral(value).format('0.[00]')
      }
    },
    data () {
      return {
        actual_responses: [],
        loading: false,
        filters_on: false,
        denominator: {population: 500, structures_targeted: 150},
      }
    },
    created() {
      this.refresh_responses()
    },
    computed: {
      ...mapState({
        slug: state => state.instance_config.slug,
        country: state => state.instance_config.name,
        components: state => state.instance_config.applets.irs_monitor.components,
        online: state => state.network_online
      }),
      responses() {
        return this.actual_responses
//        const filters = this.$store.state.irs_monitor.filters
//
//        if (filters.length > 0) {
//          const single_filter = filters[0]
//          return this.actual_responses.filter(r => {
//            return r[single_filter.type] == single_filter.value
//          })
//        } else {
//          return this.actual_responses
//        }
      },
      window_height() {
        return (window.innerHeight - 64) - 200
      },
    },
    methods: {
      decorate_responses(responses) {
        // Add weeks TODO: @refac Add 'weeks' to `responses` somewhere earlier than the dashbboard
        return responses.map(r => {
          r.week = moment(r.recorded_on).week()
          return r
        })

      },
      filter(filter) {
        if (filter.value === 'all') {
          this.$store.commit('irs_monitor/remove_filter', filter.type)
        } else {
          this.$store.commit('irs_monitor/toggle_filter', filter)
        }
      },
      refresh_responses() {
        this.loading = true
        this.$store.commit('root:set_loading', true)

        this.$store.dispatch('irs_monitor/get_all_records')
          .then((records) => {
            this.actual_responses = this.decorate_responses(records)

            this.loading = false
            this.$store.commit('root:set_loading', false)
            this.$store.commit('root:set_snackbar', {message: 'Successfully retrieved records'})
          })
          .catch(e => {
            console.log(e)
            this.loading = false
            this.$store.commit('root:set_loading', false)
          })
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
    /*margin: 2.5%;*/
    padding: 1em;
    flex: 1;
    width: 100%;
  }

  .card-half-width {
    width: 50%;
  }
</style>
