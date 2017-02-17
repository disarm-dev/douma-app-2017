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
    "irs_tasker:set_clusters_from_local": (context) => {
      return Sync.load_clusters().then(clusters => {
        context.commit("irs_tasker:set_clusters", clusters)
      })
    },
    "irs_tasker:download_clusters": (context, clusters) => {
      Sync.config(context.state.meta.team_id)
      
      return Sync.get_clusters({}).then((clusters) => {
        // clusters.forEach(cluster => {
        //   cluster.spray_team_id = null
        // })
        context.commit("irs_tasker:set_clusters", clusters)
      })
        
    },
    "irs_tasker:clear_clusters": (context) => {
      return Sync.clear_clusters().then(() => {
        context.commit("irs_tasker:set_clusters", [])
      })
    },
    "irs_tasker:save_cluster": (context, cluster) => {
      const cluster_index = context.state.irs_tasker.clusters.findIndex(c => c._id === cluster._id)

      return Sync.save_cluster(cluster).then(() => {
        context.state.irs_tasker.clusters.splice(cluster_index, 1, cluster)
      })
    },
    "irs_tasker:update_clusters_with_spray_teams": (context, clusters) => {
      // return Sync.update_clusters(clusters)
    },
  },
}