// Store for 'IRS Plan' applet
import Sync from './sync'
import IRSSync from '../irs/sync.js'

import union from '@turf/union'
import difference from '@turf/difference'

import prepare from '../../lib/formal_areas.js'

export default {
  state: {
    // State state
    selected_component: null,
    show_preview: false,

    // Data
    formal_areas: [],
    informal_draw_stack: []
  },
  getters: {
    'irs_plan:formal_bulk_result': (state) => {

    },
    'irs_plan:formal_single_result': (state) => {

    },
    'irs_plan:informal_draw_stack_result': (state) => {
      // Calculate result of informal_draw_stack
      return state.informal_draw_stack.reduce((sum, i) => sum + i.size, 0)
    },
    'irs_plan:result_clusters': (state) => {
      // Calculate the result from:
      // 
      // formal_bulk_result  formal_single_result
      // MINUS informal stack removed areas
      // PLUS informal stack add areas
      return ['always something new', 'in here']
    }
  },
  mutations: {
    'irs_plan:set_show_preview': (state, show_preview) => {
      state.show_preview = show_preview
    },
    "irs_plan:set_selected_component": (state, command) => {
      if (state.selected_component === command) command = null
      state.selected_component = command
    },
    'irs_plan:set_formal_areas': (state, formal_areas) => {
      state.formal_areas = formal_areas
    },
    'irs_plan:push_informal_draw_stack': (state, stack_action) => {
      state.informal_draw_stack.push(stack_action)
    },
  },
  actions: {
    'irs_plan:informal_draw_add': (context, feature) => {
      const stack_action = { type: 'add', feature: feature }
      context.commit('irs_plan:push_informal_draw_stack', feature)
    },
    'irs_plan:informal_draw_subtract': (context, feature) => {
      const stack_action = { type: 'subtract', feature: feature }
      context.commit('irs_plan:push_informal_draw_stack', feature)
    },
    'irs_plan:load_formal_areas': (context, country_code) => {
      context.commit('root:set_loading', true)
      console.log('irs_plan:load_formal_areas for', country_code)

      Sync.config(context.rootState.meta.demo_instance_id)
      return Sync.get_ous(country_code).then((results) => {
        context.commit('irs_plan:set_formal_areas', [])

        const formal_areas = prepare(results)

        context.commit('root:set_loading', false)
        context.commit('irs_plan:set_formal_areas', formal_areas)
        return Promise.resolve(formal_areas)
      }).catch(err => console.error(err))
    },
    'irs_plan:post_clusters': (context) => {
      const cluster_ids = context.rootState.irs.clusters.map(cluster => cluster.properties.cluster_id)
      const cluster_collection_id = context.rootState.irs.clusters[0].cluster_collection_id

      context.commit('root:set_loading', true)
      Sync.config(context.rootState.meta.demo_instance_id)
      return Sync.post_clusters({cluster_ids, cluster_collection_id}).then(() => {
        context.commit('root:set_loading', false)
        context.commit('irs:set_clusters', []) // TODO: @debug Remove
        return context.dispatch('irs:get_clusters')
      })
    }
  }
}