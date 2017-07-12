<template>
  <div class="container">

    <!--DOING BUTTONS-->
    <div class="buttons">
      <md-button class="md-raised" :disabled='loading' @click.native="load_plan">Load plan</md-button>
      <md-button class="md-raised" :disabled='loading || !plan_target_ids.length' @click.native="load_assignments">Load assignments</md-button>
      <md-button class="md-raised" :disabled="loading || !plan_target_ids.length || !assignments.length || !unsynced_changes" @click.native="save_assignments">Save assignments</md-button>
    </div>
    
    <md-card>
      <md-card-content>
        <!--LEGEND-->
        <tasker_legend
          class="legend"
          :decorated_teams="decorated_teams"
          :selected_team_name="selected_team_name"
          @selected_team="select_team"
        ></tasker_legend>

        <!--MAP-->
        <tasker_map
          v-if="geodata_ready"

          :plan_target_ids="plan_target_ids"
          :assignments="assignments"
          :decorated_teams="decorated_teams"

          @assign_areas_to_selected_team="assign_areas_to_selected_team"
        ></tasker_map>
      </md-card-content>
    </md-card>

    <!--TEAM LIST-->
    <team_list
      :assignments="assignments"
      :decorated_teams="decorated_teams"
      @selected_team="select_team"
    ></team_list>

  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import chroma from 'chroma-js'

  import {get_current_plan, create_plan} from 'lib/data/remote'

  import team_list from './team_list'
  import tasker_legend from './legend'
  import tasker_map from './tasker-map.vue'
  import {AssignmentPlan} from 'lib/models/assignment_plan.model'
  import {DECORATED_UNASSIGNED_TEAM} from '../unassigned_team'
  import {get_geodata} from 'lib/data/remote.get_geodata'

  const PALETTE = chroma.brewer.Set2

  export default {
    components: {team_list, tasker_map, tasker_legend},
    data() {
      return {
        _geodata_areas: null,
        target_areas: null,
        click_handler: null,
      }
    },
    computed: {
      ...mapState({
        instance_slug: state => state.instance_config.instance.slug,
        loading: state => state.loading,
        geodata_ready: state => state.geodata_ready,

        unsynced_changes: state => state.irs_tasker.unsynced_changes,
        selected_team_name: state => state.irs_tasker.selected_team_name,
        plan_target_ids: state => state.irs_tasker.plan_target_ids,
        assignments: state => state.irs_tasker.assignments
      }),
      decorated_teams() {
        const team_names = this.$store.state.irs_tasker.teams
        const unassigned_count = this.assignments.filter(a => a.team_name === DECORATED_UNASSIGNED_TEAM.team_name).length

        return team_names.map((team_name, index) => {
          return {
            team_name,
            colour: PALETTE[index],
            count: this.assignments.filter(a => a.team_name === team_name).length
          }
        }).filter(t => t.team_name !== DECORATED_UNASSIGNED_TEAM.team_name)
          .concat({...DECORATED_UNASSIGNED_TEAM, count: unassigned_count})
      }
    },
    mounted() {
      get_geodata(this.$store)
    },
    methods: {
      // Load plan, and load-and-save assignments
      load_plan() {
        this.$store.commit('root:set_loading', true)

        this.$store.dispatch('irs_tasker/get_current_plan')
          .then(() => { this.$store.commit('root:set_loading', false) })
          .catch(() => { this.$store.commit('root:set_loading', false) })
      },
      load_assignments() {
        this.$store.commit('root:set_loading', true)

        this.$store.dispatch('irs_tasker/load_assignment_plan')
          .then(() => { this.$store.commit('root:set_loading', false) })
          .catch(() => { this.$store.commit('root:set_loading', false) })
      },
      save_assignments() {
        this.$store.commit('root:set_loading', true)

        this.$store.dispatch('irs_tasker/save_assignment_plan')
          .then(() => { this.$store.commit('root:set_loading', false) })
          .catch(() => { this.$store.commit('root:set_loading', false) })
      },
      // Select team and assign
      assign_areas_to_selected_team(area_ids) {
        if (!Array.isArray(area_ids)) area_ids = [area_ids]

        area_ids.forEach(area_id => {
          this.$store.dispatch('irs_tasker/assign_area_to_team', {area_id, team_name: this.selected_team_name})
        })
      },
      select_team(team_name) {
        this.$store.commit('irs_tasker/set_selected_team_name', team_name)
      },

    }
  }
</script>

<style scoped>
  .buttons {
    margin-bottom: 1em;
  }

  .legend {
    margin-bottom: 1em;
  }
</style>
