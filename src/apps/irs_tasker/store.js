// Store for 'IRS Tasker' applet

import Sync from './sync.js'
import IRSSync from '../irs/sync.js'

export default {
  state: {
    // DATA
    clusters: [], // TODO: @nasty Change everything relying on this across whole of IRS - move to `irs/store.js`
    initCalled: false
  },
  mutations: {
    // DATA
    "irs_tasker:set_clusters": (state, clusters) => {
      state.clusters = clusters
    },
    "irs_tasker:set_cluster": (state, cluster) => {
      const cluster_index = state.clusters.findIndex(c => c._id === cluster._id)
      state.clusters.splice(cluster_index, 1, cluster)
    },  
  },
  actions: {
    'irs_tasker:get_clusters': (context, options) => {
      return IRSSync.get_clusters(options).then((clusters) => {

        if (clusters.length === 0 && !options.force_remote_refresh) {
          const snackbar = {
            message: 'Do you want to get remote clusters?', 
            action: () => {
              context.commit('root:set_loading', true)
              context.dispatch("irs_tasker:get_clusters", {force_remote_refresh: true, demo_instance_id: options.demo_instance_id})
            }
          }
          return context.commit('root:set_snackbar', snackbar)
        } else {
          context.commit('root:set_loading', false)
          return context.commit("irs_tasker:set_clusters", clusters)
        }
      })
    },
    'irs_tasker:update_cluster': (context, cluster) => {
      return Sync.update_cluster_local(cluster).then(() => context.commit('irs_tasker:set_cluster', cluster))
    },
    "irs_tasker:update_clusters_with_spray_teams": (context) => {
      context.commit('root:set_loading', true)
      return Sync.update_clusters_remote(context.state.clusters).then(() => context.commit('root:set_loading', false))
    },
  },
}