export default {
  namespaced: true,
  state: {
    selected_region_ids: [],
  },
  mutations: {
    'toggle_selected_region': (state, region_id) => {
      if (state.selected_region_ids.includes(region_id)) {
        let index = state.selected_region_ids.findIndex((r) => r === region_id)
        state.selected_region_ids.splice(index, 1)
      } else {
        state.selected_region_ids.push(region_id)
      }
    }
  }
}