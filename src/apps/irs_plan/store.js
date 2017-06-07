import array_unique from 'array-unique'

import {create_plan, get_current_plan, get_geodata} from '@/lib/data/remote'
import cache from '@/lib/cache.js'

export default {
  namespaced: true,
  state: {
    areas_included_by_click: [],
    areas_excluded_by_click: [],
    bulk_selected_ids: [],

    unsaved_changes: false,
  },
  getters: {
    'all_selected_area_ids': (state) => {
      const bulk_selected_ids = state.bulk_selected_ids

      // add included by click
      let result = bulk_selected_ids.concat(state.areas_included_by_click)

      // remove excluded by click
      state.areas_excluded_by_click.forEach(area_id => {
        const index = result.findIndex(i => i === area_id)
        if (index !== -1) {
          result.splice(index, 1)
        }
      })
      return result
    },
  },
  mutations: {
    "toggle_selected_target_area_id": (state, target_area_id) => {
      if (state.areas_included_by_click.includes(target_area_id)) {
        // remove target area from included

        let index = state.areas_included_by_click.findIndex((r) => r === target_area_id)
        state.areas_included_by_click.splice(index, 1)

      } else if (state.areas_excluded_by_click.includes(target_area_id)) {
        // remove target area from excluded
        let index = state.areas_excluded_by_click.findIndex((r) => r === target_area_id)
        state.areas_excluded_by_click.splice(index, 1)


      } else if (state.bulk_selected_ids.includes(target_area_id)){
        // add to excluded by click
        state.areas_excluded_by_click.push(target_area_id)

      } else if (!state.bulk_selected_ids.includes(target_area_id)) {
        // add to included by click
        state.areas_included_by_click.push(target_area_id)

      } else {
        console.log('should never see this')
      }

      state.unsaved_changes = true
    },
    'set_bulk_selected_ids': (state, selected_target_area_ids) => {
      state.bulk_selected_ids = selected_target_area_ids
    },
    'add_selected_target_areas': (state, selected_target_area_ids) => {
      let temp_array = state.areas_included_by_click.concat(selected_target_area_ids)
      let unique = array_unique(temp_array)

      state.areas_included_by_click = unique
      state.unsaved_changes = true
    },
    'set_unsaved_changes': (state, unsaved_changes) => {
      state.unsaved_changes = unsaved_changes
    },
    'clear_plan': (state) => {
      state.areas_included_by_click = []
      state.areas_excluded_by_click = []
      state.bulk_selected_ids = []
    }
  },
  actions: {
    'save_plan': (context, denominator) => {
      const country = context.rootState.instance_config.slug

      const plan = {
        planned_at: new Date(),
        country,
        denominator
      }

      return create_plan(plan)
        .then(res => {
          context.commit('set_unsaved_changes', false)
        })
    },
    'get_current_plan': (context) => {
      const country = context.rootState.instance_config.slug
      const field_name = context.rootState.instance_config.spatial_hierarchy[0].field_name

      return get_current_plan(country).then(plan => {
        if (plan.hasOwnProperty('denominator') && plan.denominator.length !== 0 ) {
          let target_areas = plan.denominator.map(area => {
            return area[field_name]
          })
          context.commit('clear_plan')
          context.commit('add_selected_target_areas', target_areas)
          context.commit('set_unsaved_changes', false)
        }
      })
    },
    'get_geodata': (context, {slug, level, cache}) => {
      return get_geodata({slug, level, cache})
    }
  }
}
