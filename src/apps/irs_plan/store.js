// Store for 'IRS Plan' applet
import Sync from './sync'
import selected_clusters from '../../lib/cluster_results'


export default {
  state: {
    // State state
    selected_component: null,

    // Data - 'areas' are formal areas, like 'localities'
    risk_slider_value: null,
    formal_areas: [],
    areas_included_by_click: [], // TODO: @refac Rename to '_ids'
    areas_excluded_by_click: [], // TODO: @refac Rename to '_ids'

  },
  getters: {
    'irs_plan:formal_area_ids': (state) => {
      return state.formal_areas.map(area => area.properties.area_id)
    },
    'irs_plan:bulk_selected_ids': (state) => {
      console.log(state.risk_slider_value)
      return state.formal_areas
        .filter(area => area.properties.MaxRisk >= state.risk_slider_value)
        .map(area => area.properties.area_id)
    },
    'irs_plan:all_selected_area_ids': (state, getters) => {
      const bulk_selected_ids = getters['irs_plan:bulk_selected_ids']

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
    }

  },
  mutations: {
    'irs_plan:set_risk_slider': (state, risk_slider_value) => {
      state.risk_slider_value = risk_slider_value
    },
    "irs_plan:set_selected_component": (state, command) => {
      if (state.selected_component === command) command = null
      state.selected_component = command
    },
    'irs_plan:set_formal_areas': (state, formal_areas) => {
      state.formal_areas = formal_areas
    },
    'irs_plan:set_all_clusters': (state, all_clusters) => {
      // state.all_clusters = all_clusters
      state.all_clusters = []
    },
    'irs_plan:add_included': (state, area_id) => {
      state.areas_included_by_click.push(area_id)
    },
    'irs_plan:remove_included': (state, area_id) => {
      let index = state.areas_included_by_click.findIndex(i => i === area_id)  
      state.areas_included_by_click.splice(index, 1)
    },
    'irs_plan:add_excluded': (state, area_id) => {
      state.areas_excluded_by_click.push(area_id)
    },
    'irs_plan:remove_excluded': (state, area_id) => {
      let index = state.areas_excluded_by_click.findIndex(i => i === area_id)  
      state.areas_excluded_by_click.splice(index, 1)
    },

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
    'irs_plan:load_formal_areas': (context) => {
      context.commit('root:set_loading', true)
      Sync.config(context.rootState.meta.demo_instance_id)

      return Sync.get_ous(context.rootState.meta.country.slug).then((formal_areas) => {
        context.commit('irs_plan:set_formal_areas', [])
        context.commit('irs_plan:set_formal_areas', formal_areas)
        context.commit('root:set_loading', false)
        return formal_areas
      }).catch(err => console.error(err))
    },
    'irs_plan:load_clusters': (context) => {
      context.commit('root:set_loading', true)

      return fetch(DOUMA_API_URL + '/v2/clusters/all/swz') // TODO: @refac Don't put this fetch in here. Also add `country.slug`
        .then((res) => res.json())
        .then((all_clusters) => {
          context.commit('root:set_loading', false)
          return all_clusters.features
        }).catch(console.log)

    },
    'irs_plan:calculate_selected_clusters': (context, all_clusters) => {
      return selected_clusters(all_clusters, context.getters['irs_plan:all_selected_area_ids'])
    },
    'irs_plan:post_clusters': (context, {cluster_ids, cluster_collection_id}) => {
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