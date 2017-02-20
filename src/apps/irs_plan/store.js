// Store for 'IRS Plan' applet

import Sync from './data/sync.js'

export default {
  state: {
    // DATA
    localities: [],
    country_code: null,
    selected_localities: [],
    clusters: [],
  },
  mutations: {
    'irs_plan:set_localities': (state, localities) => {
      state.localities = localities
    },  
    'irs_plan:set_clusters': (state, clusters) => {
      state.clusters = clusters
    },
    'irs_plan:set_selected_localities': (state, selected_localities) => {
      state.selected_localities = selected_localities
    }
  },
  actions: {
    'irs_plan:set_demo_instance_id': (context, demo_instance_id) => {
      Sync.config(demo_instance_id)
    },
    'irs_plan:get_ous': (context, country_code) => {
      // console.log('getting clusters')
      return Sync.get_ous(country_code).then((results) => {
        // TODO: @refac Do this model stuff somewhere else

        const localities = results.features

        context.commit('irs_plan:set_localities', localities)
      })
    },
    "irs_plan:start_clustering": (context, country_code) => {
      const dist_km = 0.25
      const max_size = 50

      const polygons = {
        type: 'FeatureCollection',
        features: context.state.selected_localities
      }

      return Sync.get_clusters({country_code, polygons, dist_km, max_size})
      .then(res => context.commit("irs_plan:set_clusters", res))
      .catch(err => console.error(err))
    } 
  }
}