import {create_plan, get_current_plan} from '@/lib/data/remote'

export default {
  namespaced: true,
  state: {
    selected_target_area_ids: [],
  },
  mutations: {
    "toggle_selected_target_area_id": (state, target_area_id) => {
      if (state.selected_target_area_ids.includes(target_area_id)) {
        let index = state.selected_target_area_ids.findIndex((r) => r === target_area_id)
        state.selected_target_area_ids.splice(index, 1)
      } else {
        state.selected_target_area_ids.push(target_area_id)
      }
    },
    'set_selected_target_areas_id': (state, selected_target_area_ids) => {
      state.selected_target_area_ids = selected_target_area_ids
    },
    'clear_plan': (state) => {
      state.selected_target_area_ids = []
    }
  },
  actions: {
    'save_plan': (context) => {
      const target_areas = context.state.selected_target_area_ids
      const country = context.rootState.instance_config.slug.toLowerCase()

      const plan = {
        planned_at: new Date(),
        country,
        target_areas
      }

      return create_plan(plan)
    },
    'get_current_plan': (context) => {
      const country = context.rootState.instance_config.slug.toLowerCase()

      return get_current_plan(country)
    }
  }
}
