<template>
  <div>
    <!--  SUMMARY, LOAD, DOWNLOAD (DUMPING GROUND) -->
    <dashboard_summary :responses='responses' @load_responses="load_responses" @load_plan="load_plan"></dashboard_summary>

    <div class='applet_container'>

      <!--DASHBOARD CONTROLS-->
      <controls :responses="responses" :targets="targets"></controls>

      <!--MAP-->
      <dashboard_map
        :responses="responses"
        :targets="targets"
        :aggregations="aggregations"
        :options="with_dashboard_options(map_options)">
      </dashboard_map>

      <!--TABLE-->
      <dashboard_table
        :responses="responses"
        :targets="targets"
        :aggregations="aggregations"
        :options="with_dashboard_options(table_options)">
      </dashboard_table>

      <!-- CUSTOM STATIC-DATA CHARTS, etc -->
      <charts
        :responses="responses"
        :targets="targets"
        :aggregations="aggregations"
        :options="with_dashboard_options(chart_configs)"></charts>
    </div>
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import {cloneDeep as clone_deep} from 'lodash'

  import {get_geodata} from 'lib/models/geodata/remote.js'

  // Components
  import dashboard_summary from './dashboard-summary.vue'
  import controls from './controls/controls.vue'
  import dashboard_map from './map/dashboard-map.vue'
  import dashboard_table from './table/dashboard-table.vue'
  import charts from './charts/dashboard-charts.vue'
  import {geodata_in_cache_and_valid} from '../../../lib/models/geodata/geodata.valid'

  export default {
    name: 'Dashboard',
    components: {
      dashboard_summary,
      controls,
      dashboard_map,
      dashboard_table,
      charts,
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config,

        // Aggregations from instance_config
        aggregations: state => state.instance_config.aggregations,

        // Options
        dashboard_options: state => state.irs_monitor.dashboard_options,

        // Options (passed to components)
        table_options: state => state.instance_config.applets.irs_monitor.table,
        map_options: state => state.instance_config.applets.irs_monitor.map,
        chart_configs: state => state.instance_config.applets.irs_monitor.charts,

      }),
      ...mapGetters({
        responses: 'irs_monitor/filtered_responses',
        targets: 'irs_monitor/targets',
      }),
    },
    methods: {
      load_responses() {
        this.$startLoading('irs_monitor/load_responses')

        this.$store.dispatch('irs_monitor/get_all_records')
          .then(() => {
            this.$endLoading('irs_monitor/load_responses')
            this.$store.commit('root:set_snackbar', {message: 'Successfully retrieved responses'})
          })
          .catch(e => {
            console.log(e)
            this.$endLoading('irs_monitor/load_responses')
          })
      },
      load_plan() {
        this.$startLoading('irs_monitor/load_plan')

        this.$store.dispatch('irs_monitor/get_current_plan')
          .then(() => {
            this.$endLoading('irs_monitor/load_plan')
            this.$store.commit('root:set_snackbar', {message: 'Successfully retrieved plan'})
          })
          .catch(e => {
            console.log(e)
            this.$endLoading('irs_monitor/load_plan')
          })
      },
      with_dashboard_options(options) {
        if (Array.isArray(options)) {
          // We have an array of chart configurations
          const chart_configs = options

          return chart_configs.map(config => {
            let clone = clone_deep(config)
            clone.options = {
              ...clone.options,
              ...this.dashboard_options
            }
            return clone
          })

        } else {
          // Just have a simple `options` object (for either map or table)
          return {
            ...options,
            ...this.dashboard_options
          }
        }
      }
    }
  }
</script>

<style scoped>
  .card {
    display: inline-block;
    margin: 1% 2.5%;
    flex: 1;
    width: 95%;
  }
</style>
