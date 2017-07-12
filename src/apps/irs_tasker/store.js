import {AssignmentSchema} from 'lib/models/assignment.schema'
import {AssignmentPlan} from 'lib/models/assignment_plan.model'
import {DECORATED_UNASSIGNED_TEAM} from 'apps/irs_tasker/unassigned_team'
import {get_current_plan} from 'lib/data/remote.plans'
import {get_assignment_plan, create_assignment_plan} from 'lib/data/remote.assignment_plan'

export default {
  namespaced: true,
  state: {
    teams: [],
    assignments: [], // Array of {area_id, team_name}

    plan_target_ids: [],
  },
  mutations: {
    clear_data_storage:(state) => {
      state.teams = []
      state.assignments = []
    },
    "set_teams": (state, teams) => {
      state.teams = teams
    },
    "set_assignment": (state, {area_id, team_name}) => {
      const assignment = state.assignments.find(a => a.area_id === area_id)

      if (assignment) {
        // update it
        assignment.team_name = team_name
      } else {
        const assignment = {area_id, team_name}

        if (AssignmentSchema(assignment)) {
          state.assignments.push(assignment)
        } else {
          console.error(AssignmentSchema.errors(assignment))
          throw new Error('Invalid AssignmentPlan')
        }
      }
    },
    "set_assignments": (state, assignments) => {
      state.assignments = assignments
    },
    "delete_assignment": (state, assignment) => {
      const index = state.assignments.findIndex(a => a.area_id === assignment.area_id)
      state.assignments.splice(1, index)
    },
    'set_plan_target_ids': (state, plan_target_ids) => {
      state.plan_target_ids = plan_target_ids
    }
  },
  actions: {
    'update_teams': (context, teams) => {
      const sorted_teams = teams.sort((a, b) =>{
        if(a < b) return -1;
        if(a > b) return 1;
        return 0;
      })

      context.commit('set_teams', sorted_teams)
    },
    'assign_area_to_team': (context, {area_id, team_name}) => {
      if (team_name === null) {
        context.commit('delete_assignment', {area_id, team_name})
      } else {
        context.commit('set_assignment', {area_id, team_name})
      }
    },

    'get_current_plan': (context) => {
      return get_current_plan().then((plan_json) => {
        const plan_target_ids = new AssignmentPlan().extract_target_ids_from_plan(plan_json)
        context.commit('set_plan_target_ids', plan_target_ids)
      })
    },
    'load_assignment_plan': (context) => {
      return get_assignment_plan().then(assignment_plan_json => {
        const {assignments, teams} = new AssignmentPlan().create_from_json(assignment_plan_json)
        context.commit('set_assignments', assignments)
        context.commit('set_teams', teams)
      })
    },
    'save_assignments': (context) => {

    }
  }
}
