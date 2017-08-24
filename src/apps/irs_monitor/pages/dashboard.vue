<template>
  <div>
    <!--  SUMMARY, LOAD, DOWNLOAD (DUMPING GROUND) -->
    <dashboard_summary :responses='responses' @refresh_data="refresh_data"></dashboard_summary>

    <div class='applet_container'>

      <!--DASHBOARD CONTROLS-->
      <controls v-if="geodata_ready" :responses="responses"></controls>

      <!--&lt;!&ndash;MAP&ndash;&gt;-->
      <!--<dashboard_map-->
        <!--v-if='geodata_ready'-->
        <!--:responses="responses"-->
        <!--:targets="targets"-->
        <!--:aggregations="aggregations"-->
        <!--:options="with_dashboard_options(map_options)"></dashboard_map>-->

      <!--&lt;!&ndash;TABLE&ndash;&gt;-->
      <!--<dashboard_table-->
        <!--:responses="responses"-->
        <!--:targets="targets"-->
        <!--:aggregations="aggregations"-->
        <!--:options="with_dashboard_options(table_options)">-->
      <!--</dashboard_table>-->

      <!--&lt;!&ndash; CUSTOM STATIC-DATA CHARTS, etc &ndash;&gt;-->
      <!--<charts-->
        <!--:responses="responses"-->
        <!--:targets="targets"-->
        <!--:aggregations="aggregations"-->
        <!--:options="with_dashboard_options(chart_configs)"></charts>-->
    </div>
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'

  import {get_geodata} from 'lib/remote/remote.geodata.js'

  // Components
  import dashboard_summary from './dashboard-summary.vue'
  import controls from './controls/controls.vue'
  import dashboard_map from './map/dashboard-map.vue'
  import dashboard_table from './table/dashboard-table.vue'
  import charts from './charts/dashboard-charts.vue'

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
        geodata_ready: state => state.geodata_ready,

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
    created() {
      get_geodata(this.$store)//.then(this.refresh_data())
    },
    methods: {
      refresh_data() {
        this.$startLoading('irs_monitor/refresh_data')

        Promise.all([
          this.$store.dispatch('irs_monitor/get_all_records'),
          this.$store.dispatch('irs_monitor/get_current_plan'),

        ])
          .then(() => {
            this.$endLoading('irs_monitor/refresh_data')
            this.$store.commit('root:set_snackbar', {message: 'Successfully retrieved records'})
          })
          .catch(e => {
            console.log(e)
            this.$endLoading('irs_monitor/refresh_data')
          })
      },
      with_dashboard_options(options) {
        return options
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
