<template>
  <div class='container'>

    <div class="controls">

      <md-button
        class="md-icon-button md-raised"
        :class="{'md-warn': edit_mode}"
        :disabled="loading || !geodata_ready"
        @click.native='edit_mode = !edit_mode'
      >
        <md-icon>edit</md-icon>
      </md-button>


      <!-- MENU -->
      <md-menu md-direction="bottom right" md-size="6">
        <md-button class="md-icon-button md-raised" md-menu-trigger>
          <md-icon>more_vert</md-icon>
        </md-button>

        <md-menu-content>
          <md-menu-item @click="load_plan" :disabled="loading">
            <md-icon>assignment_turned_in</md-icon>
            <span>Load plan</span>
          </md-menu-item>

          <!--EDIT MODE-->
          <md-menu-item :disabled="!unsaved_changes" @click="save_plan">
            <md-icon>save</md-icon>
            <span>Save plan</span>
          </md-menu-item>

          <md-menu-item :disabled='!can_clear' @click.native="clear_plan">
            <md-icon>delete</md-icon>
            <span>Clear plan</span>
          </md-menu-item>

        </md-menu-content>
      </md-menu>

      <div>
        {{title}} plan {{current_plan_date ? `from ${current_plan_date}` : ''}}
      </div>
    </div>


    <div v-if="online">
      <!-- FILTER TO LIMIT PLAN -->
      <plan_filter
        v-if="can_focus_planning && geodata_ready"
        :unsaved_changes="unsaved_changes"
      ></plan_filter>


      <!--PLAN MAP-->
      <md-card>
        <md-card-content>
          <plan_map
            :geodata_ready="geodata_ready"
            :edit_mode="edit_mode"
            :selected_filter_area_id="selected_filter_area_id"
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
  import get from 'lodash.get'

  import plan_filter from './plan-filter.vue'
  import plan_summary from './plan-summary.vue'
  import plan_map from './plan-map.vue'
  import cache from 'config/cache.js'
  import {Plan} from 'lib/models/plan.model.js'
  import {get_geodata} from 'lib/data/remote'
  import {get_planning_level_name, get_planning_level_id_field, get_next_level_up_from_planning_level} from 'lib/spatial_hierarchy_helper'
  import {target_areas_inside_focus_filter_area} from 'lib/irs_plan_helper'

  export default {
    name: 'Plan',
    components: {plan_filter, plan_summary, plan_map},
    data() {
      return {
        edit_mode: false,
        edit_disabled: true,
      }
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config,
        loading: state => state.loading,
        online: state => state.network_online,
        geodata_loading_progress: state => state.geodata_loading_progress,
        geodata_ready: state => state.geodata_ready,

        current_plan: state => state.irs_plan.current_plan,
        selected_filter_area_id: state => get(state, 'irs_plan.selected_filter_area_option.id', null),
        unsaved_changes: state => state.irs_plan.unsaved_changes,
        current_plan_date: state =>  {
          if (state.irs_plan.current_plan) {
            return moment(state.irs_plan.current_plan.planned_at).format('hh:mm a DD MMM YYYY')
          }
        },
      }),
      can_focus_planning() {
        // TODO: @refac Improve checking if planning can be focused
        return get_next_level_up_from_planning_level()
      },
      next_level_up_from_planning_level() {
        return get_next_level_up_from_planning_level()
      },
      ...mapGetters({
        selected_target_area_ids: 'irs_plan/all_selected_area_ids',
        selected_filter_area: 'irs_plan/selected_filter_area'
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
    mounted() {
      get_geodata(this.$store)
    },
    methods: {
      load_plan() {
        this.$store.commit('root:set_loading', true)

        this.$store.dispatch('irs_plan/get_current_plan')
          .then(() => { this.$store.commit('root:set_loading', false) })
          .catch(() => { this.$store.commit('root:set_loading', false) })

      },
      save_plan() {
        let plan_targets = this.selected_target_area_ids

        if (this.selected_filter_area) {
          plan_targets = target_areas_inside_focus_filter_area({
            area_ids: this.selected_target_area_ids,
            selected_filter_area: this.selected_filter_area
          })
        }

        const focus_filter_area_just_id = {
          id: null
        }
        
        // TODO: Don't need this complicated approach
        // TODO: @feature Make it obvious to the user that they need to select a filter_area before they can save. 
        if (this.selected_filter_area) {
          focus_filter_area_just_id.id = this.selected_filter_area.properties[this.next_level_up_from_planning_level.field_name]
        }

        const plan = new Plan().create({
          focus_filter_area: focus_filter_area_just_id,
          instance_config: this.instance_config,
          selected_target_area_ids: plan_targets
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
