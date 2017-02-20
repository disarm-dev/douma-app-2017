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
    'irs_tasker:configure_sync': (context, demo_instance_id) => {
      Sync.config(demo_instance_id)
    },
    "irs_tasker:set_clusters_from_local": (context) => {
      return Sync.load_clusters().then(clusters => {
        context.commit("irs_tasker:set_clusters", clusters)
      })
    },
    "irs_tasker:download_clusters": (context, clusters) => {
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
      const cluster_index = context.state.clusters.findIndex(c => c._id === cluster._id)
      context.state.clusters.splice(cluster_index, 1, cluster)
    },
    "irs_tasker:update_clusters_with_spray_teams": (context) => {
      const clusters = context.state.clusters.map(cluster => {
        delete cluster.polygon.properties.original_cluster
        return cluster
      })
      return Sync.update_clusters(clusters)
    },
  },
}