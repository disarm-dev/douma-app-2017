import focis from './focis.json'

export default {
  state: {
    focis: focis
  },
  mutations: {
    'foci:update_cluster': (state, foci) => {
      let index = state.focis.findIndex(f => f.properties._id === foci.properties._id)
      state.focis.splice(index, 1, foci)
    }
  },
  actions: {
  }
}
