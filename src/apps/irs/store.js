import IRSSync from './sync'

export default {
  state: {
    clusters: []
  },
  getters: {
    unsynced_clusters: (state) => {
      return state.clusters.filter(cluster => cluster._sync_status !== 'synced')
    }
  },
  mutations: {
    'irs:set_clusters': (state, clusters) => {
      state.clusters = clusters
    },
    'irs:set_cluster': (state, cluster) => {
      const cluster_index = state.clusters.findIndex(c => c._id === cluster._id)
      state.clusters.splice(cluster_index, 1, cluster)
    },  
  },
  actions: {
    'irs:get_clusters': (context) => {
      let demo_instance_id = context.rootState.meta.demo_instance_id
      context.commit('root:set_loading', true)
      return IRSSync.get_clusters({demo_instance_id}).then(clusters => {
        context.commit('root:set_loading', false) // TODO: @refac Replace root:set_loading with a global method call to make simpler to follow, and less cluttered with `commits`
        context.commit('irs:set_clusters', clusters)
        return clusters
      })
    },

    'irs:update_cluster': (context, cluster) => {
      cluster._sync_status = 'unsynced'
      return IRSSync.update_cluster_local(cluster).then(() => context.commit('irs:set_cluster', cluster))
    },

    'irs:update_clusters': (context) => {
      const unsynced_clusters = context.getters.unsynced_clusters
      let demo_instance_id = context.rootState.meta.demo_instance_id
      context.commit('root:set_loading', true)
      return IRSSync.update_clusters_remote(unsynced_clusters, {demo_instance_id}).then(() => {
        const promises = unsynced_clusters.map(cluster => {
          cluster._sync_status = 'synced'
          return IRSSync.update_cluster_local(cluster).then(() => context.commit('irs:set_cluster', cluster))
        })
        return Promise.all(promises).then(() => context.commit('root:set_loading', false))
      })
    },
    'irs:redo_clusters': (context) => {
      return context.dispatch('irs:delete_clusters')
    },
    'irs:delete_clusters': (context) => {
      context.commit('root:set_loading', true)
      let demo_instance_id = context.rootState.meta.demo_instance_id
      return IRSSync.delete_clusters(demo_instance_id).then(() => {
        context.commit('irs:set_clusters', [])
        context.commit('root:set_loading', false)
        return Promise.resolve()
      }) 
    }
  }
}
