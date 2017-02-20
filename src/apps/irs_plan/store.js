// Store for 'IRS Plan' applet

import Sync from './data/sync.js'

export default {
  state: {
    // DATA
    localities: [],
    selected_localities: [],
    clusters: [],
  },
  mutations: {
    'irs_plan:set_localities': (state, localities) => {
      state.localities = localities
    },  
  },
  actions: {
    'irs_plan:set_team_id': (context, team_id) => {
      Sync.config(team_id)
    },
    'irs_plan:get_localities': (context) => {
      // console.log('getting clusters')
      return Sync.get_localities().then((results) => {
        // TODO: @refac Do this model stuff somewhere else

        const localities = results.map((locality) => {
          // locality.polygon.properties.original_locality = locality
          // locality.polygon.properties.selected = true
          return locality.polygon
        })

        context.commit('irs_plan:set_localities', localities)
      })
    },
    "irs_plan:start_clustering": (context) => {
      const country_code = 'ZWE'
      const dist_km = 0.25
      const max_size = 50

      const polygons = {
        type: 'FeatureCollection',
        features: context.state.localities
      }

      return Sync.get_clusters({country_code, polygons, dist_km, max_size})
    } 
  }
}