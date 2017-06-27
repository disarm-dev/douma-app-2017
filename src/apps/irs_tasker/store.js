import chroma from 'chroma-js'

export default {
  namespaced: true,
  state: {
    teams: [],
  },
  mutations: {
    "set_teams": (state, teams) => {
      state.teams = teams
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
    }
  }
}
