import chroma from 'chroma-js'
import {AssignmentSchema} from '../../lib/models/assignment.schema'

export default {
  namespaced: true,
  state: {
    teams: [],
    assignments: [] // Array of {area_id, team_name}
  },
  mutations: {
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
          throw new Error('Invalid Assignment')
        }
      }
    },
    "set_assignments": (state, assignments) => {
      state.assignments = assignments
    },
    "delete_assignment": (state, assignment) => {
      const index = state.assignments.findIndex(a => a.area_id === assignment.area_id)
      state.assignments.splice(1, index)
    }
  },
  actions: {
    'update_teams': (context, teams) => {
      // TODO: @feature actually sort by name - where 'space' comes after 'A', not before
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
    'load_assignments_from_plan': () => {},
    'save_assignments_to_plan': () => {}
  }
}