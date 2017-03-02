import IRSSync from './sync'

export default {
  state: {
    clusters: []
  },
  mutations: {
    'irs:set_clusters': (state, clusters) => {
      state.clusters = clusters
    }
  },
  actions: {
    'irs:get_clusters': (context) => {
      let demo_instance_id = context.rootState.meta.demo_instance_id
      context.commit('root:set_loading', true)
      return IRSSync.get_clusters({demo_instance_id}).then(clusters => {
        context.commit('root:set_loading', false)
        context.commit('irs:set_clusters', clusters)
        return clusters
      })
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