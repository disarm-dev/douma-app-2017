import array_unique from 'array-unique'

import {create_plan, get_current_plan, get_geodata} from '@/lib/data/remote'
import cache from '@/lib/cache.js'

export default {
  namespaced: true,
  state: {
    selected_target_area_ids: [],
    unsaved_changes: false,
  },
  mutations: {
    "toggle_selected_target_area_id": (state, target_area_id) => {
      if (state.selected_target_area_ids.includes(target_area_id)) {
        let index = state.selected_target_area_ids.findIndex((r) => r === target_area_id)
        state.selected_target_area_ids.splice(index, 1)
      } else {
        state.selected_target_area_ids.push(target_area_id)
      }
      state.unsaved_changes = true
    },
    'set_selected_target_areas_id': (state, selected_target_area_ids) => {
      state.selected_target_area_ids = selected_target_area_ids
    },
    'add_selected_target_areas': (state, selected_target_area_ids) => {
      let temp_array = state.selected_target_area_ids.concat(selected_target_area_ids)
      let unique = array_unique(temp_array)

      state.selected_target_area_ids = unique
    },
    'set_unsaved_changes': (state, unsaved_changes) => {
      state.unsaved_changes = unsaved_changes
    },
    'clear_plan': (state) => {
      state.selected_target_area_ids = []
    }
  },
  actions: {
    'save_plan': (context) => {
      const target_areas = context.state.selected_target_area_ids
      const country = context.rootState.instance_config.slug

      const plan = {
        planned_at: new Date(),
        country,
        target_areas
      }


      return create_plan(plan)
        .then(res => {
          context.commit('set_unsaved_changes', false)
        })
    },
    'get_current_plan': (context) => {
      const country = context.rootState.instance_config.slug

      return get_current_plan(country).then(plan => {
        if (plan.hasOwnProperty('target_areas') && plan.target_areas.length > 0) {
          context.commit('set_selected_target_areas_id', plan.target_areas)
          context.commit('set_unsaved_changes', false)
        }
      })
    },
    'get_geodata'(context, {slug, level, cache}) {
      return get_geodata({slug, level, cache})
    }
  }
}
