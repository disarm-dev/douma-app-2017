<template>
  <div class="container">
    <h1>Assign teams</h1>
    <md-button class="md-accent" @click.native="recreate_assignments_from_plan">Recreate assignments from most recent Plan</md-button>

    <md-button class="md-primary md-raised" :disabled="!assignments.length" @click.native="save">Save</md-button>

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

  import {get_current_plan, create_plan} from 'lib/data/remote'

  import team_list from './team_list'
  import tasker_legend from './legend'
  import tasker_map from './tasker-map.vue'
  import {Assignment} from 'lib/models/assignment.model'
  import {DECORATED_UNASSIGNED_TEAM} from '../unassigned_team'

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
        instance_config: state => state.instance_config, // TODO: @refac Only use `slug`
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
      this.$store.dispatch('irs_tasker/get_current_plan').then(() => {
        if (this.decorated_teams.length) {
          this.selected_team_name = this.decorated_teams[0].team_name
        }
      })
    },
    save() {
//      this.$store.dispatch('irs_tasker/save_assignments')

      get_current_plan(this.instance_config.slug).then((plan_json) => {
        let new_targets = plan_json.targets.map((target) => {
          let assignment = this.assignments.find((a) => a.area_id === target.id)
          target.assigned_to_team_name = assignment.team_name
          return target
        })

        const plan = {
          ...plan_json,
          targets: new_targets
        }

        // Bump time by 10 seconds to make this plan newer than the old one
        const new_date = new Date(plan.planned_at)
        new_date.setSeconds(new_date.getSeconds() + 10)
        plan.planned_at = new_date

        // Mongo complains if we try insert a document with an existing ID
        delete plan._id

        console.log(plan)

        // Something is
        create_plan(plan).then(() => {
          this.$store.commit('root:set_snackbar', {message: 'Assignments updated succesfully'})
        })
      })
    }
  }
  }
</script>

<style scoped>

</style>
