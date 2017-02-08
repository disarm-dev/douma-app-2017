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
      context.dispatch("irs_progress:get_remote_clusters")
        .then((clusters) => context.dispatch("irs_progress:save_local_clusters", clusters))

      context.dispatch("irs_progress:get_remote_tasks")
        .then((tasks) => context.dispatch("irs_progress:save_local_tasks", tasks))

      context.dispatch("irs_progress:get_remote_spatial_entities")
        .then((spatial_entities) => context.dispatch("irs_progress:save_local_spatial_entities", spatial_entities))
    },
    "irs_progress:clear_local_data": (context) => {
      DB.clusters.clear().then(DB.tasks.clear())
        .then(DB.spatial_entities.clear())
        .then(() => {
          context.commit("irs_progress:set_clusters", null)
          context.commit("irs_progress:set_tasks", null)
          context.commit("irs_progress:set_spatial_entities", null)
        })
    },
    "irs_progress:save_local_clusters": (context, clusters) => {
      DB.clusters.bulkAdd(clusters).then(res => context.commit("irs_progress:set_clusters", clusters))
    },
    "irs_progress:save_local_tasks": (context, tasks) => {
      DB.tasks.bulkAdd(tasks).then(res => context.commit("irs_progress:set_tasks", tasks))
    },
    "irs_progress:save_local_spatial_entities": (context, spatial_entities) => {
      DB.spatial_entities.bulkAdd(spatial_entities).then(res => context.commit("irs_progress:set_spatial_entities", spatial_entities))
    },




    "irs_progress:update_active_task": (context, taskClone) => {
      delete taskClone.distance // TODO: @feature Maybe want to use this to validate proximity to structure when record created

      DB.tasks.update(taskClone.id, taskClone).then((res) => {
        context.commit("irs_progress:update_task_state", taskClone)
        context.commit("irs_progress:set_active_task", null)
      }).catch((error) => console.error(error))
    },


    // REMOTE DATA + DB
    "irs_progress:search_remote_clusters": (context, filters) => {
      // req.params.filters.location = filters.location
      if (filters.locations.length === 0) {
        return
      }

      const params = JSON.stringify(filters.locations)
      const url = `${DOUMA_API_URL}/clusters?locations=${params}`
      console.log(url)

      return fetch(url)
        .then(res => res.json())
        .then(json => {
          const clusters_search_results = json.data
          return(clusters_search_results)
        })
    },
    "irs_progress:get_remote_clusters": (context, filters) => {
      // req.params.filters.cluster_ids = filters.cluster_ids
      return fetch(`${DOUMA_API_URL}/clusters`)
        .then(res => res.json())
    },
    "irs_progress:get_remote_tasks": (context, filters) => {
      // req.params.filters.task_ids = filters.task_ids
      return fetch(`${DOUMA_API_URL}/tasks?ids=[1,2,3,4]`)
        .then(res => res.json())
    },
    "irs_progress:get_remote_spatial_entities": (context, filters) => {
      // req.params.filters.spatial_entity_ids = filters.spatial_entity_ids
      return fetch(`${DOUMA_API_URL}/spatial_entities?ids=[1,2,3,4]`)
        .then(res => res.json())
    },
    "irs_progress:sync_local_tasks": (context, filters) => {
      console.log('GET REMOTE & RESOLVE CONFLICTS')
      context.dispatch("irs_progress:get_remote_tasks")
        .then(context.dispatch("irs_progress:post_local_tasks"))
    },


    // 
    // SYNC
    // 
    "irs_progress:request_remote_tasks": (context) => {
      console.log('request_remote_tasks')
        // TODO: @debug Just need to return a Promise
      const promise = new Promise((resolve, reject) => resolve())
      return promise
    },
    "irs_progress:send_local_tasks": (context) => {
      console.log('send_local_tasks')
    },






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