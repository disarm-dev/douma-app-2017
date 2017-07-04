<template>
  <div class='container'>
    <h2>Table and map update with real records</h2>

    <h4 v-if='!plan' style="color: red">No plan! No way forward until you have one</h4>

    <!--  SUMMARY, LOAD, DOWNLOAD (DUMPING GROUND) -->
    <dashboard_summary @refresh_data="refresh_data"></dashboard_summary>

    <!--FILTERS-->
    <filters></filters>

    <!--MAP-->
    <map_progress v-if='geodata_ready' :aggregated_responses="aggregated_responses" :geodata_ready="geodata_ready"></map_progress>

    <!--TABLE-->
    <table_progress :aggregated_responses="aggregated_responses"></table_progress>

    <!-- CUSTOM STATIC-DATA CHARTS, etc -->
    <charts :aggregated_responses="aggregated_responses"></charts>

  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import which_polygon from 'which-polygon'

  import cache from 'config/cache.js'
  import {get_planning_level_id_field, get_planning_level_name} from 'lib/spatial_hierarchy_helper'
  import {get_geodata} from 'lib/data/remote'

  // Components
  import dashboard_summary from './dashboard-summary.vue'
  import filters from './filters.vue'
  import table_progress from './common/dashboard-table.vue'
  import map_progress from './common/dashboard-map.vue'
  import charts from './custom_charts.vue'

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
        plan: state => state.irs_monitor.plan,
        geodata_ready: state => state.geodata_ready,
      }),
      ...mapGetters({
        filtered_responses: 'irs_monitor/filtered_responses',
        aggregated_denominators: 'irs_monitor/aggregated_denominators',
        aggregated_responses: "irs_monitor/aggregated_responses",
      }),
      planning_level_name() {
        return get_planning_level_name(this.instance_config)
      },
    },
    mounted() {
      get_geodata(this.$store)//.then(this.refresh_data())
    },
    methods: {
      refresh_data() {
        this.$store.commit('root:set_loading', true)

        Promise.all([
          this.$store.dispatch('irs_monitor/get_all_records'),
          this.$store.dispatch('irs_monitor/get_current_plan'),

        ])
          .then(() => {
            this.$store.commit('root:set_loading', false)
            this.$store.commit('root:set_snackbar', {message: 'Successfully retrieved records'})
          })
          .catch(e => {
            console.log(e)
            this.$store.commit('root:set_loading', false)
          })
      },
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
</style>
