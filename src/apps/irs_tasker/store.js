// Store for 'IRS Tasker' applet

import Sync from './data/sync.js'

export default {
  state: {
    // DATA
    clusters: [],
  },
  mutations: {
    // DATA
    "irs_record:set_clusters": (state, clusters) => {
      state.clusters = clusters
    },
  },
  actions: {

  },

}