export default {
  namespaced: true,
  state: {
    selected_target_area_ids: [],
  },
  mutations: {
    'toggle_selected_target_area': (state, target_area_id) => {
      if (state.selected_target_area_ids.includes(target_area_id)) {
        let index = state.selected_target_area_ids.findIndex((r) => r === target_area_id)
        state.selected_target_area_ids.splice(index, 1)
      } else {
        state.selected_target_area_ids.push(target_area_id)
      }
    },
    'clear_plan': (state) => {
      state.selected_target_area_ids = []
    }
  }
}
