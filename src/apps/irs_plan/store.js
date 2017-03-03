// Store for 'IRS Plan' applet

import Sync from './sync.js'
import IRSSync from '../irs/sync.js'
import {remove_properties} from '../../lib/map_helpers'

export default {
  state: {
    // DATA
    localities: [],
    selected_localities: [],
  },
  mutations: {
    'irs_plan:set_localities': (state, localities) => {
      state.localities = localities
    },

    'irs_plan:set_selected_localities': (state, selected_localities) => {
      state.selected_localities = selected_localities
    }
  },
  actions: {
    'irs_plan:set_demo_instance_id': (context) => {
      Sync.config(context.rootState.meta.demo_instance_id)
    },
    'irs_plan:get_ous': (context, country_code) => {
      context.commit('root:set_loading', true)
      context.commit('irs_plan:set_localities', [])
      return Sync.get_ous(country_code).then((results) => {
        const localities = results.features
        context.commit('root:set_loading', false)
        context.commit('irs_plan:set_localities', localities)
        return Promise.resolve(localities)
      })
    },
    'irs_plan:start_clustering': (context, country_code) => {
      const dist_km = 0.25
      const max_size = 50

      let polygons = {
        type: 'FeatureCollection', 
        features: context.state.selected_localities
      }

      polygons = remove_properties(polygons)
      context.commit('root:set_loading', true)
      return Sync.cluster_yourself({country_code, polygons, dist_km, max_size})
      .then(res => {
        context.commit('root:set_loading', false)
        context.commit("irs:set_clusters", res)
        return res
    })
    },
    'irs_plan:post_clusters': (context) => {
      const clusters = context.rootState.irs.clusters
      const demo_instance_id = context.rootState.meta.demo_instance_id
      context.commit('root:set_loading', true)
      return Sync.post_clusters(clusters).then(() => {
        context.commit('root:set_loading', false)
        return context.commit('irs:set_clusters', clusters)
      })
    }
  }
}