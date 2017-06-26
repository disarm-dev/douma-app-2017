export default {
  namespaced: true,
  state: {
    teams: [],
    selected: {}
  },
  mutations: {
    "add_team": (state, team) => {
      state.teams.push(team)
    },
    "update_team": (state, team) => {
      let index = state.teams.findIndex(t => t.id === team.id)
      state.teams.splice(index, 1, team)
    },
    "remove_team": (state, team) => {
      let index = state.teams.findIndex(t => t.id === team.id)
      state.teams.splice(index, 1)
    },
    "toggle_selected_area": (state, {team, area_id}) => {
      // TODO: @feature Check if area is in other teams selected ids

      if (state.selected[team]) {
        if (state.selected[team].includes(area_id)) {
          let index = state.selected[team].findIndex(area => area === area_id)
          state.selected[team].splice(index, 1)
        } else {
          state.selected[team].push(area_id)
        }
      } else {
        state.selected[team] = [area_id]
      }
    }
  },
  actions: {
    "add_team": (context, {team}) => {
      // do server stuff
      context.commit('add_team', team)
    },
    "update_team": (context, {team}) => {
      // do server stuff
      context.commit('update_team', team)
    },
    "remove_team": (context, {team}) => {
      // do server stuff
      context.commit('remove_team', team)
    }
  }
}
