export default {
  namespaced: true,
  state: {
    locations: []
  },
  mutations: {
    add_location: (state, location) => {
      state.locations.unshift(location)
    },
    delete_location: (state, location) => {
      const index = state.locations.findIndex(l => l.id === location.id)
      state.locations.splice(index, 1)
    }
  },
  getters: {},
  actions: {}
}
