import chroma from 'chroma-js'

export default {
  namespaced: true,
  state: {
    teams: [],
    assignments: []
  },
  mutations: {
    "set_teams": (state, teams) => {
      state.teams = teams
    },
    "set_assignment": (state, {area_id, team_name}) => {
      const assignment = state.assignments.find(a => a.area_id === area_id)

      if (assignment) {
        assignment.team_name = team_name 
        // update it
        // state.assignments.splice(1, index, assignment)
        // Vue.set(vm.someObject, 'b', 2)
      } else {
        state.assignments.push({area_id, team_name})
      }
    },
    "delete_assignment": (state, assignment) => {
      const index = state.assignments.findIndex(a => a.area_id === assignment.area_id)
      state.assignments.splice(1, index)
    }
  },
  actions: {
    'update_teams': (context, teams) => {
      // sort by name
      teams = teams.sort((a, b) =>{
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
      })
      
      context.commit('set_teams', teams)
    },
    'assign_area_to_team': (context, {area_id, team_name}) => {
      if (team_name === null) {
        context.commit('delete_assignment', {area_id, team_name})
      } else {
        context.commit('set_assignment', {area_id, team_name})
      }
    }
  }
}
