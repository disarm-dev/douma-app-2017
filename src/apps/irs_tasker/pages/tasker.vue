<template>
  <div class="container">
    <h1>Assign teams</h1>
    <md-button class="md-accent" @click.native="recreate_assignments_from_plan">Recreate assignments from most recent Plan</md-button>
    <tasker_legend :decorated_teams="decorated_teams" :selected_team_name="selected_team_name" @selected_team="select_team"></tasker_legend>

    <tasker_map
      :assignments="assignments"
      :decorated_teams="decorated_teams"
      @assign_areas_to_selected_team="assign_areas_to_selected_team"
    ></tasker_map>

    <team_list :assignments="assignments" :decorated_teams="decorated_teams"></team_list>

  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import chroma from 'chroma-js'

  import {get_current_plan} from 'lib/data/remote'

  import team_list from './team_list'
  import tasker_legend from './legend'
  import tasker_map from './tasker-map.vue'
  import {Assignment} from 'lib/models/assignment.model'
  import {DECORATED_UNASSIGNED_TEAM} from '../unassigned_team'
  import {get_geodata} from 'lib/data/remote'

  const PALETTE = chroma.brewer.Set3


  export default {
    components: {team_list, tasker_map, tasker_legend},
    data() {
      return {
        _geodata_areas: null,
        target_areas: null,
        selected_team_name: '',
        click_handler: null,
      }
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config,
        assignments: state => state.irs_tasker.assignments,
        team_names: state => state.irs_tasker.teams,
      }),
      decorated_teams() {
        const unassigned_count = this.assignments.filter(a => a.team_name === DECORATED_UNASSIGNED_TEAM.team_name).length

        const teams = this.team_names.map((team_name, index) => {
          return {
            team_name,
            colour: PALETTE[index],
            count: this.assignments.filter(a => a.team_name === team_name).length
          }
        }).concat({...DECORATED_UNASSIGNED_TEAM, count: unassigned_count})

        return teams
      }
    },
    mounted() {
      get_geodata(this.$store)
    },
    methods: {
      assign_areas_to_selected_team(area_ids) {
        if (!Array.isArray(area_ids)) area_ids = [area_ids]

        area_ids.forEach(area_id => {
          this.$store.dispatch('irs_tasker/assign_area_to_team', {area_id, team_name: this.selected_team_name})
        })
      },
      select_team(team_name) {
        this.selected_team_name = team_name
      },
      recreate_assignments_from_plan() {
        // TODO: @feature handle failure
        return get_current_plan(this.instance_config.slug).then((plan_json) => {

          const assignments = new Assignment().assignments_from_plan(plan_json)
          this.$store.commit('irs_tasker/set_assignments', assignments)

          const teams = new Assignment().team_names_from_assignments(assignments)
          this.$store.commit('irs_tasker/set_teams', teams)

          this.selected_team_name = this.decorated_teams[0].team_name
        })
      },
    }
  }
</script>

<style scoped>

</style>
