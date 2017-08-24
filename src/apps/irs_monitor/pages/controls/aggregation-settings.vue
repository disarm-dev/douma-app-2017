<template>
  <div>
    <h2>Aggregation settings</h2>
    <p @click="debug_change_option">
      Spatial aggregation level: '{{spatial_aggregation_level}}' (planning level)
      {{spatial_level_names.join(",")}}
    </p>
    <p>Temporal aggregatation level: 'week'</p>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import {get_planning_level_name} from 'lib/geodata/spatial_hierarchy_helper'
  import {get_all_spatial_hierarchy_level_names} from 'lib/geodata/spatial_hierarchy_helper'

  /**
   * Control various elements of the dashboard. Any settings here cascade down to all tables, maps, charts.
   * Primary controls to set here:
   *  - spatial_aggregation_level: one of the geodata spatial levels (including the planning level and upwards)
   *  - temporal_aggregation_level: ['weeks', 'months', 'quarters', etc]. As per `moment-range` (https://github.com/rotaready/moment-range#by)
   */
  export default {
    name: 'aggregation-settings',
    mounted() {
    },
    computed: {
      ...mapState({
        spatial_aggregation_level: state => state.irs_monitor.dashboard_options.spatial_aggregation_level,
        temporal_aggregation_level: state => state.irs_monitor.dashboard_options.temporal_aggregation_level
      }),
      spatial_level_names: function () {
        return get_all_spatial_hierarchy_level_names()
      }
    },
    created() {
      this.create_defaults()
    },
    methods: {
      create_defaults() {
        if (!this.spatial_aggregation_level) {
          const planning_level_name = get_planning_level_name()
          console.log('no spatial_aggregation_level set, using planning_level_name', planning_level_name)

        }
      },
      debug_change_option() {
        console.log('debug_change_option')
        this.$store.commit('irs_monitor/set_dashboard_options', {new_one: true})
      }
    }
  }
</script>

<style scoped>

</style>
