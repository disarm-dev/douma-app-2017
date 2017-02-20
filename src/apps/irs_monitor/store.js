// Store for 'IRS Monitor' applet

import Sync from './data/sync.js'

export default {
  state: {
    // DATA
    clusters: null,
    tasks: null
  },
  mutations: {
    'irs_monitor:set_clusters': (state, clusters) => {
      state.clusters = clusters
    },

    'irs_monitor:set_tasks': (state, tasks) => {
      state.tasks = tasks
    }
    
  },
  actions: {
    'irs_monitor:set_demo_instance_id': (context, demo_instance_id) => {
      Sync.config(demo_instance_id)
    },
    'irs_monitor:get_clusters': (context) => {
      console.log('getting clusters')
      Sync.get_clusters().then((clusters) => {
        context.commit('irs_monitor:set_clusters', clusters)
      })
    },
    'irs_monitor:get_tasks': (context) => {
      console.log('getting tasks')
      Sync.get_tasks().then((tasks) => {
        context.commit('irs_monitor:set_tasks', tasks)
      })
    }
  }
}