export default {
  namespaced: true,
  state: {
    teams: []
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
