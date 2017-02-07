// Store for IRS-Progress 

import turf from '@turf/turf'
import DB from '../../db.js'

// TODO: @debug Remove rough global for DB
window.db = DB

export default {
  state: {
    // EDITING
    active_task: null,

    // DATA
    clusters: [],
    tasks: [],
    spatial_entities: [],

    // SYNC
    sync_in_progress: false
  },
  mutations: {
    // EDITING
    "irs_progress:set_active_task": (state, task) => {
      state.active_task = task
    },
    "irs_progress:update_task_state": (state, task) => { // For the map?
      let index = state.tasks.findIndex(t => t.id == task.id)
      state.tasks.splice(index, 1, task)
    },

    // DATA
    "irs_progress:set_clusters": (state, clusters) => {
      state.clusters = clusters
    },
    "irs_progress:set_tasks": (state, tasks) => {
      state.tasks = tasks
    },
    "irs_progress:set_spatial_entities": (state, spatial_entities) => {
      state.spatial_entities = spatial_entities
    },
    
    // SYNC
    "irs_progress:setSyncInProgress": (state, syncState) => {
      state.sync_in_progress = !!(syncState)
    },
  },
  actions: {
    // EDITING
    "irs_progress:set_active_task_by_osm_id": (context, osm_id) => {
      // TODO: @check Do this `find` on the $store rather than DB?
      let foundTask = context.state.tasks.find(task => task.osm_id === osm_id)
      context.commit('irs_progress:set_active_task', foundTask)
    },


    // LOCAL DATA + DB
    "irs_progress:load_local_data": (context) => {
      context.dispatch('irs_progress:load_clusters')
      context.dispatch('irs_progress:load_tasks')
      context.dispatch('irs_progress:load_spatial_entities')
    },
    "irs_progress:load_clusters": (context) => {
      DB.clusters.toArray().then((res) => context.commit("irs_progress:set_clusters", res))
    },
    "irs_progress:load_tasks": (context) => {
      DB.tasks.toArray().then((res) => context.commit("irs_progress:set_tasks", res))
    },
    "irs_progress:load_spatial_entities": (context) => {
      DB.spatial_entities.toArray().then((res) => context.commit("irs_progress:set_spatial_entities", res))
    },
    "irs_progress:seed_local_data": (context) => {
      DB.clusters.clear().then(DB.tasks.clear()).then(DB.spatial_entities.clear()).then(() => {
        const clusters = require('../../data_bootstrap/clusters.json')
        const tasks = require('../../data_bootstrap/tasks.json')
        const spatial_entities = require('../../data_bootstrap/spatial_entities.json')
        console.log('cleared, resetting...')
        context.dispatch("irs_progress:save_local_clusters", clusters)
        context.dispatch("irs_progress:save_local_tasks", tasks)
        context.dispatch("irs_progress:save_local_spatial_entities", spatial_entities)
      })
    },
    "irs_progress:save_local_clusters": (context, clusters) => {
      DB.clusters.bulkAdd(clusters).then( res => console.log(res) )
    },
    "irs_progress:save_local_tasks": (context, tasks) => {
      DB.tasks.bulkAdd(tasks).then( res => console.log(res) )
    },
    "irs_progress:save_local_spatial_entities": (context, spatial_entities) => {
      DB.spatial_entities.bulkAdd(spatial_entities).then( res => console.log(res) )
    },




    "irs_progress:update_active_task": (context, taskClone) => {
      delete taskClone.distance // TODO: @feature Maybe want to use this to validate proximity to structure when record created

      DB.tasks.update(taskClone.id, taskClone).then((res) => {
        context.commit("irs_progress:update_task_state", taskClone)
        context.commit("irs_progress:set_active_task", null)
      }).catch((error) => console.error(error))
    },


    // REMOTE DATA + DB
    // searchClusters -> get selected fields for Clusters
    // getClustersFromRemote -> 



    // 
    // SYNC
    // 
    "irs_progress:sync_tasks": (context) => {
      context.dispatch("irs_progress:request_remote_tasks")
      .then(context.dispatch("irs_progress:send_local_tasks")
      )
    },
    "irs_progress:request_remote_tasks": (context) => {
      console.log('request_remote_tasks')
      // TODO: @debug Just need to return a Promise
      const promise = new Promise((resolve, reject) => resolve())
      return promise
    },
    "irs_progress:send_local_tasks": (context) => console.log('send_local_tasks'),

    "irs_progress:deleteAllTasks": (context) => {
      // DB.tasks.list().then((res) => {
      //   // Delete all in parallel
      //   return Promise.all(res.data.map((task) => {
      //     return DB.tasks.delete(task.id)
      //   }))
      // }).then(() => {
      //   // Reset Tasks
      //   DB.tasks.list().then((res) => {
      //     context.commit("irs_progress:setTasks", res.data)
      //   })
      // }).catch((error) => console.error(error))
    },
    "irs_progress:finishTasks": (context) => {
      context.commit("irs_progress:setSyncInProgress", true)

      context.dispatch("irs_progress:sync").then(() => {
        context.commit("irs_progress:reset")
        window.douma.data.irs_progress.entities = []
        if (window.douma.data.irs_progress.entitiesLayer) {
          window.douma.data.irs_progress.entitiesLayer.remove()
          window.douma.data.irs_progress.entitiesLayer = null
        }

        context.commit("irs_progress:setSyncInProgress", false)
      })
    },
  }
}


// TODO: @feature Do we need a function that returns colours from text - e.g. for charts, etc?
// e.g. 'visited' => #70b170