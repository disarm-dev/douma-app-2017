import array_unique from 'array-unique'

import {create_plan, get_current_plan, get_geodata} from '@/lib/data/remote'
import cache from '@/lib/cache.js'

export default {
  namespaced: true,
  state: {
    areas_included_by_click: [],
    areas_excluded_by_click: [],
    bulk_selected_ids: [],

    selected_target_area_ids: [],
    unsaved_changes: false,
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
        // add to 
        state.areas_excluded_by_click.push(target_area_id)

      } else if (!state.bulk_selected_ids.includes(target_area_id)) {
        state.areas_included_by_click.push(target_area_id)

      } else {
        console.log('should never see this')
      }

      state.unsaved_changes = true
    },
    'set_selected_target_areas_id': (state, selected_target_area_ids) => {
      state.selected_target_area_ids = selected_target_area_ids
      state.unsaved_changes = true
    },
    'set_bulk_selected_ids': (state, selected_target_area_ids) => {
      state.bulk_selected_ids = selected_target_area_ids
    },
    'add_selected_target_areas': (state, selected_target_area_ids) => {
      let temp_array = state.selected_target_area_ids.concat(selected_target_area_ids)
      let unique = array_unique(temp_array)

      state.selected_target_area_ids = unique
      state.unsaved_changes = true
    },
    'set_unsaved_changes': (state, unsaved_changes) => {
      state.unsaved_changes = unsaved_changes
    },
    'clear_plan': (state) => {
      state.selected_target_area_ids = []
    }
  },
  actions: {
    'irs_plan:area_click': (context, area_id) => {
      if (context.state.areas_included_by_click.includes(area_id)) {
        context.commit('irs_plan:remove_included', area_id)
      } else if (context.state.areas_excluded_by_click.includes(area_id)) {
        context.commit('irs_plan:remove_excluded', area_id)
      } else if (context.getters['irs_plan:bulk_selected_ids'].includes(area_id)){
        context.commit('irs_plan:add_excluded', area_id)
      } else if (!context.getters['irs_plan:bulk_selected_ids'].includes(area_id)) {
        context.commit('irs_plan:add_included', area_id)
      } else {
        console.log('should never see this')
      }
    },
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

          context.commit('set_selected_target_areas_id', target_areas)
          context.commit('set_unsaved_changes', false)
        }
      })
    },
    'get_geodata'(context, {slug, level, cache}) {
      return get_geodata({slug, level, cache})
    }
  }
}
