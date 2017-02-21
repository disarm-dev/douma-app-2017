// Store for 'IRS Monitor' applet

import Sync from './data/sync.js'

export default {
  state: {
    // DATA
    clusters: null,
    tasks: null,
    taskCounts: {
      total: 0,
      unvisited: 0,
      visited_successful: 0,
      visited_unsuccessful: 0
    }
  },
  mutations: {
    'irs_monitor:set_clusters': (state, clusters) => {
      state.clusters = clusters
    },

    'irs_monitor:set_tasks': (state, tasks) => {
      state.tasks = tasks
    },

    'irs_monitor:set_tasks_count': (state, count) => {
      state.taskCounts.total = count
    },

    'irs_monitor:set_unvisited_count': (state, count) => {
      state.taskCounts.unvisited = count
    },

    'irs_monitor:set_successful_count': (state, count) => {
      state.taskCounts.visited_successful = count
    },

    'irs_monitor:set_unsuccessful_count': (state, count) => {
      state.taskCounts.visited_unsuccessful = count
    }
    
  },
  actions: {
    'irs_monitor:set_demo_instance_id': (context, demo_instance_id) => {
      Sync.config(demo_instance_id)
    },

    'irs_monitor:get_tasks_count': (context) => {
      Sync.count_tasks({}).then(({count}) => {
        context.commit('irs_monitor:set_tasks_count', count)
      })
    },
    'irs_monitor:get_tasks_unvisited': (context) => {
      Sync.count_tasks({
        "properties.status": "unvisited"
      }).then(({count}) => {
        context.commit('irs_monitor:set_unvisited_count', count)
      })
    },

    'irs_monitor:get_tasks_successful': (context) => {
      Sync.count_tasks({
        "properties.status": "visited_successful"
      }).then(({count}) => {
        context.commit('irs_monitor:set_successful_count', count)
      })
    },

    'irs_monitor:get_tasks_unsuccessful': (context) => {
      Sync.count_tasks({
        "properties.status": "visited_unsuccessful"
      }).then(({count}) => {
        context.commit('irs_monitor:set_unsuccessful_count', count)
      })
    }
  }
}