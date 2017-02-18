// Store for 'IRS Plan' applet

import Sync from './data/sync.js'

export default {
  state: {
    // DATA
    clusters: null,
  },
  mutations: {
    // 'irs_plan:set_clusters': (state, clusters) => {
    //   state.clusters = clusters
    // },

    // 'irs_plan:set_tasks': (state, tasks) => {
    //   state.tasks = tasks
    // }
    
  },
  actions: {
    'irs_plan:set_team_id': (context, team_id) => {
      Sync.config(team_id)
    },
    // 'irs_plan:get_clusters': (context) => {
    //   console.log('getting clusters')
    //   Sync.get_clusters().then((clusters) => {
    //     context.commit('irs_plan:set_clusters', clusters)
    //   })
    // },
    // 'irs_plan:get_tasks': (context) => {
    //   console.log('getting tasks')
    //   Sync.get_tasks().then((tasks) => {
    //     context.commit('irs_plan:set_tasks', tasks)
    //   })
    // }
  }
}