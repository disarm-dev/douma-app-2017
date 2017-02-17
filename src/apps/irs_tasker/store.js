// Store for 'IRS Tasker' applet

import Sync from './data/sync.js'

export default {
  state: {
    // DATA
    clusters: [],
  },
  mutations: {
    // DATA
    "irs_tasker:set_clusters": (state, clusters) => {
      state.clusters = clusters
    },
  },
  actions: {
    "irs_tasker:download_clusters": (context, clusters) => {
      const team_id = 1 // TODO: @debug Remove this fake team_id
      Sync.config(team_id)
      Sync.get_clusters({}).then((clusters) => {
        console.table(clusters)
        clusters.forEach(cluster => {
          cluster.spray_team_id = null
        })
        context.commit("irs_tasker:set_clusters", clusters)
      })
        
    }
  },
}