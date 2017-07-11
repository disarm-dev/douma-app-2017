import array_unique from 'array-unique'

import {create_plan, get_current_plan} from 'lib/data/remote'
import {Plan} from 'lib/models/plan.model'

export default {
  namespaced: true,
  state: {
    current_plan: null,
    areas_included_by_click: [],
    areas_excluded_by_click: [],
    bulk_selected_ids: [],

    // Map
    selected_filter_area_id: null,

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
        console.log('💥should never see this')
      }

      state.unsaved_changes = true
    },
    'set_bulk_selected_ids': (state, selected_target_area_ids) => {
      state.bulk_selected_ids = selected_target_area_ids
      state.unsaved_changes = true
    },
    'add_selected_target_areas': (state, selected_target_area_ids) => {
      let temp_array = state.bulk_selected_ids.concat(selected_target_area_ids)
      let unique = array_unique(temp_array)

      state.bulk_selected_ids = unique
      state.unsaved_changes = true
    },
    'set_unsaved_changes': (state, unsaved_changes) => {
      state.unsaved_changes = unsaved_changes
    },
    'clear_plan': (state) => {
      state.areas_included_by_click = []
      state.areas_excluded_by_click = []
      state.bulk_selected_ids = []
      state.current_plan = null
      state.unsaved_changes = true
    },
    'set_plan': (state, plan) => {
      state.current_plan = plan
    },
    'set_selected_filter_area_id': (state, id) => {
      state.selected_filter_area_id = id
    }
  },
  actions: {
    'save_plan': (context, plan) => {

      return create_plan(plan)
        .then(() => {
          context.commit('set_plan', plan)
          context.commit('set_unsaved_changes', false)
        })
    },
    'get_current_plan': (context) => {
      const country = context.rootState.instance_config.instance.slug

      return get_current_plan(country).then(plan_json => {
        try {
          new Plan().validate(plan_json)
        } catch (e) {
          console.error(e)
          context.commit('root:set_snackbar', {message: 'ERROR: Plan is not valid'}, {root: true})
        }

        let target_areas = plan_json.targets.map(area => {
          return area.id
        })

        context.commit('clear_plan')
        context.commit('set_plan', plan_json)
        context.commit('add_selected_target_areas', target_areas)
        context.commit('set_unsaved_changes', false)
      })
    }
  }
}
