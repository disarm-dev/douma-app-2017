// Store for 'IRS Plan' applet

import Sync from './data/sync.js'

export default {
  state: {
    // DATA
    localities: null,
    clusters: null,
  },
  mutations: {
    'irs_plan:set_localities': (state, localities) => {
      state.localities = localities
    },

    // 'irs_plan:set_tasks': (state, tasks) => {
    //   state.tasks = tasks
    // }
    
  },
  actions: {
    'irs_plan:set_team_id': (context, team_id) => {
      Sync.config(team_id)
    },
    'irs_plan:get_localities': (context) => {
      // console.log('getting clusters')
      Sync.get_localities().then((localities) => {
        context.commit('irs_plan:set_localities', localities)
      })
    },
    // 'irs_plan:get_tasks': (context) => {
    //   console.log('getting tasks')
    //   Sync.get_tasks().then((tasks) => {
    //     context.commit('irs_plan:set_tasks', tasks)
    //   })
    // }
  }
}