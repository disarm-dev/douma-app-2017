// Store for 'IRS Plan' applet
import Sync from './sync'

export default {
  state: {
    // State state
    selected_component: null,
    show_preview: false,

    // Data
    formal_areas: [],
    informal_draw_stack: [],
    localities_included_by_click: [],
    localities_excluded_by_click: [],
    // bulk_selected: []
  },
  getters: {
    bulk() {
      return {
        selected: [],
        unselected: []
      }
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
    'irs_plan:add_included': (state, locality_id) => {
      state.localities_included_by_click.push(locality_id)
    },
    'irs_plan:remove_included': (state, locality_id) => {
      let index = state.localities_included_by_click.findIndex(i => i === locality_id)  
      state.localities_included_by_click.splice(index, 1)
    },
    'irs_plan:add_excluded': (state, locality_id) => {
      state.localities_excluded_by_click.push(locality_id)
    },
    'irs_plan:remove_excluded': (state, locality_id) => {
      let index = state.localities_excluded_by_click.findIndex(i => i === locality_id)  
      state.localities_excluded_by_click.splice(index, 1)
    },

  },
  actions: {
    'irs_plan:locality_click': (context, locality_id) => {
      if (context.state.localities_included_by_click.includes(locality_id)) {
        context.commit('irs_plan:remove_included', locality_id)
      } else if (context.state.localities_excluded_by_click.includes(locality_id)) {
        context.commit('irs_plan:remove_excluded', locality_id)
      } else if (context.getters.bulk.selected.includes(locality_id)){
        context.commit('irs_plan:add_excluded', locality_id)
      } else if (!context.getters.bulk.selected.includes(locality_id)) {
        context.commit('irs_plan:add_included', locality_id)
      } else {
        console.log('should never see this')
      }
    },
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
      Sync.config(context.rootState.meta.demo_instance_id)

      return Sync.get_ous(country_code).then((formal_areas) => {
        context.commit('irs_plan:set_formal_areas', [])
        context.commit('irs_plan:set_formal_areas', formal_areas)
        context.commit('root:set_loading', false)
        return formal_areas
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