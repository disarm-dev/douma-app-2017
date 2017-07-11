<template>
  <div class='container'>
    <h4>
      {{title}} plan {{current_plan_date ? `from ${current_plan_date}` : ''}}
    </h4>

    <div v-if="online">
      <!-- FILTER TO LIMIT PLAN -->
      <plan_filter
        v-if="next_level_up_from_planning_level"
        @filter_selected="filter_selected"
      ></plan_filter>

      <!--SELECT MODE-->
      <md-checkbox v-model="edit_mode" :disabled="edit_disabled">Edit mode</md-checkbox>
      <md-checkbox :disabled='!geodata_ready || edit_mode' v-model="risk_visible">Show risk</md-checkbox>

      <!--VIEW MODE-->
      <md-button v-if='!edit_mode' :disabled='!geodata_ready' class='md-raised' @click.native="load_plan">Load from remote</md-button>

      <!--EDIT MODE-->
      <md-button v-if='edit_mode' :disabled="!unsaved_changes" class='md-raised md-primary' @click.native="save_plan">Save</md-button>
      <md-button v-if='edit_mode' :disabled="!unsaved_changes" class='md-raised md-warn' @click.native="load_plan">Cancel edits</md-button>
      <md-button v-if='edit_mode' :disabled='!can_clear' class='md-raised' @click.native="clear_plan">Clear plan</md-button>

      <!--PLAN MAP-->
      <md-card>
        <md-card-content>
          <plan_map
            :geodata_ready="geodata_ready"
            :edit_mode="edit_mode"
            :risk_visible="risk_visible"
            :selected_filter_area_id="selected_filter_area_id"
            :filtered_area_ids="filtered_area_ids"
            v-on:map_loaded="edit_disabled = false"
          ></plan_map>
        </md-card-content>
      </md-card>



      <!--PLAN SUMMARY-->
      <md-card class="card"><md-card-content>
        <plan_summary :geodata_ready="geodata_ready"></plan_summary>
      </md-card-content></md-card>
    </div>

    <!-- Offline -->
    <div v-else>
      <h3>Plan only available with a network connection.</h3>
    </div>

    <!-- Progress-->
    <md-dialog ref="geodata_loading_modal" :md-click-outside-to-close="false">
      <md-dialog-title>Loading base layers</md-dialog-title>

      <md-dialog-content class="centred">
        <md-spinner :md-progress="geodata_loading_progress"></md-spinner>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button :disabled='!geodata_ready' class="md-primary" @click.native="$refs.geodata_loading_modal.close()">Start planning!</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import moment from 'moment'
  import whichPolygon from 'which-polygon';
  import {featureCollection} from '@turf/helpers'
  import centroid from '@turf/centroid'
  import {getCoord} from '@turf/invariant'

  import plan_filter from './plan-filter.vue'
  import plan_summary from './plan-summary.vue'
  import plan_map from './plan-map.vue'
  import cache from 'config/cache.js'
  import {Plan} from 'lib/models/plan.model.js'
  import {get_geodata} from 'lib/data/remote'
  import {get_planning_level_name, get_planning_level_id_field, get_next_level_up_from_planning_level} from 'lib/spatial_hierarchy_helper'

  export default {
    name: 'Plan',
    components: {plan_filter, plan_summary, plan_map},
    data() {
      return {
        edit_mode: false,
        edit_disabled: true,
        risk_visible: false,

        dropdown_areas: [],
        filtered_area_ids: [],
      }
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config,
        selected_filter_area_id: state => state.irs_plan.selected_filter_area_id,
        unsaved_changes: state => state.irs_plan.unsaved_changes,
        online: state => state.network_online,
        geodata_loading_progress: state => state.geodata_loading_progress,
        geodata_ready: state => state.geodata_ready,
        current_plan_date: state =>  {
          if (state.irs_plan.current_plan) {
            return moment(state.irs_plan.current_plan.planned_at).format('hh:mm a DD MMM YYYY')
          }
        },
      }),
      next_level_up_from_planning_level() {
        return get_next_level_up_from_planning_level()
      },
      planning_level_id_field() {
        return get_planning_level_id_field(this.instance_config)
      },
      planning_level_name() {
        return get_planning_level_name(this.instance_config)
      },
      ...mapGetters({
        selected_target_area_ids: 'irs_plan/all_selected_area_ids'
      }),
      title() {
        if (!this.edit_mode) return "View"
        if (this.edit_mode && !this.current_plan_date) return "Create"
        if (this.edit_mode && this.current_plan_date) return "Edit"
       },
      can_clear() {
        return this.selected_target_area_ids.length !== 0
      }
    },
    watch: {
      'edit_mode': 'disable_risk_in_edit_mode',
      "filtered_area_id": "redraw_map"
    },
    mounted() {
      get_geodata(this.$store).then(this.load_plan)
    },
    methods: {
      // Filtering
      filter_selected(filter_option) {
        this.$store.commit('irs_plan/set_selected_filter_area_id', filter_option.id)
      },




      load_plan() {
        this.$store.commit('root:set_loading', true)

        this.$store.dispatch('irs_plan/get_current_plan')
          .then(() => { this.$store.commit('root:set_loading', false) })
          .catch(() => { this.$store.commit('root:set_loading', false) })

      },
      save_plan() {

        const plan = new Plan().create({
          instance_config: this.instance_config,
          selected_target_area_ids: this.selected_target_area_ids,
        })

        this.$store.commit('root:set_loading', true)
        this.$store.dispatch('irs_plan/save_plan', plan)
          .then(() => {
            this.$store.commit('root:set_snackbar', {message: 'Successful save'})
            this.$store.commit('root:set_loading', false)
          })
          .catch(() => {
            this.$store.commit('root:set_snackbar', {message: 'Not saved. Something wrong.'})
            this.$store.commit('root:set_loading', false)
          })
      },
      clear_plan() {
        this.$store.commit('irs_plan/clear_plan')
      },
      disable_risk_in_edit_mode() {
        if (this.edit_mode) {
          this.risk_visible = false
        }
      },
      redraw_map() {
        console.log('redraw_map')

        const polygon = cache.geodata[this.top_level_hierarchy.name].features.find((polygon) => {
          return polygon.properties[this.top_level_hierarchy.field_name] === this.filtered_area_id
        })

        const query = whichPolygon(featureCollection([polygon]))

        const points = cache.geodata[this.planning_level_name].features.map((feature) => {
          const point = centroid(feature)
          point.properties = feature.properties
          return point
        })


        let points_in_polygon_properties = points.map((point) => {
          const coordinates = getCoord(point)
          if (query([coordinates[0], coordinates[1]])) {
            return point.properties
          }
        })


        points_in_polygon_properties = points_in_polygon_properties.filter(a => a)

        const area_ids_in_polygon = points_in_polygon_properties.map((properties) => {
          return properties[this.planning_level_id_field]
        })

        this.filtered_area_ids = area_ids_in_polygon
      }
    }
  }
</script>

<style scoped>
  .card {
    margin-top: 10px;
  }

  .centred {
    margin: 0 auto;
  }

  .md-chip {
    background: orange;
    color: white;
  }

  .not-container {
    display: flex;
  }

  .not-container-child {
    flex: 1;
  }


</style>
