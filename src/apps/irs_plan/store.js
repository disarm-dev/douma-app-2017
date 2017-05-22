export default {
  namespaced: true,
  state: {
    selected_regions: [],
  },
  mutations: {
    'toggle_selected_region': (state, regionId) => {
      if (state.selected_regions.includes(regionId)) {
        let index = state.selected_regions.findIndex((r) => r === regionId)
        state.selected_regions.splice(index, 1)
      } else {
        state.selected_regions.push(regionId)
      }
    }
  },
}