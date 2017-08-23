<template>
  <div>
    <!--  SUMMARY, LOAD, DOWNLOAD (DUMPING GROUND) -->
    <dashboard_summary :responses='responses' @refresh_data="refresh_data"></dashboard_summary>

    <div class='applet_container'>

      <!--FILTERS-->
      <filters v-if="geodata_ready" :responses="responses"></filters>

      <!--MAP-->
      <!-- <map_progress
        v-if='geodata_ready'
        :aggregated_responses="aggregated_responses"
        :filtered_responses="filtered_responses"
      ></map_progress> -->

      <!--TABLE-->
      <table_progress :options="table_options" :responses="responses" :targets="targets"></table_progress>

      <!-- CUSTOM STATIC-DATA CHARTS, etc -->
      <charts :responses="responses" :targets="targets"></charts>

    </div>
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import which_polygon from 'which-polygon'

  import cache from 'config/cache.js'
  import {get_planning_level_id_field, get_planning_level_name} from 'lib/geodata/spatial_hierarchy_helper'
  import {get_geodata} from 'lib/remote/remote.geodata.js'

  // Components
  import dashboard_summary from './dashboard-summary.vue'
  import filters from './filters.vue'
  import table_progress from './dashboard-table.vue'
  import map_progress from './dashboard-map.vue'
  import charts from './charts.vue'

  export default {
    name: 'Dashboard',
    components: {
      dashboard_summary,
      filters,
      table_progress,
      map_progress,
      charts,
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config,
        table_options: state => state.instance_config.applets.irs_monitor.table,
        geodata_ready: state => state.geodata_ready,
      }),
      ...mapGetters({
        responses: 'irs_monitor/filtered_responses',
        targets: 'irs_monitor/targets'
      }),
      planning_level_name() {
        return get_planning_level_name()
      },
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
