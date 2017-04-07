import focis from './focis.json'

export default {
  state: {
    focis: focis
  },
  mutations: {
    'foci:update_foci': (state, foci) => {
      let index = state.focis.findIndex(f => f.properties._id === foci.properties._id)
      state.focis.splice(index, 1, foci)
    }
  },
  actions: {
    'foci:accept_suggestion': (context, foci) => {
      foci.geometry = foci.properties.suggested.geometry
      delete foci.properties.suggested
      context.commit('foci:update_cluster', foci)
    },
    'foci:disard_suggestion': (context, foci) => {
      delete foci.properties.suggested
      context.commit('foci:update_cluster', foci)
    }
  }
}
