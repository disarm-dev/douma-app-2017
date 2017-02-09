// Store for IRS-Progress 

import turf from '@turf/turf'
import Sync from './sync.js'

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
    "irs_record:set_active_task": (state, task) => {
      state.active_task = task
    },
    "irs_record:update_task_state": (state, task) => { // For the map?
      let index = state.tasks.findIndex(t => t.id == task.id)
      state.tasks.splice(index, 1, task)
    },

    // DATA
    "irs_record:set_clusters": (state, clusters) => {
      state.clusters = clusters
    },
    "irs_record:set_tasks": (state, tasks) => {
      state.tasks = tasks
    },
    "irs_record:set_spatial_entities": (state, spatial_entities) => {
      state.spatial_entities = spatial_entities
    },

    // SYNC
    "irs_record:setSyncInProgress": (state, syncState) => {
      state.sync_in_progress = !!(syncState)
    },
  },
  actions: {
    // EDITING
    "irs_record:set_active_task_by_osm_id": (context, osm_id) => {
      // TODO: @check Do this `find` on the $store rather than DB?
      let foundTask = context.state.tasks.find(task => task.osm_id === osm_id)
      context.commit('irs_record:set_active_task', foundTask)
    },


    // LOCAL DATA + DB
    "irs_record:load_local_data": (context) => {
      context.dispatch('irs_record:load_clusters')
      context.dispatch('irs_record:load_tasks')
      context.dispatch('irs_record:load_spatial_entities')
    },
    "irs_record:load_clusters": (context) => {
      DB.clusters.toArray().then((res) => context.commit("irs_record:set_clusters", res))
    },
    "irs_record:load_tasks": (context) => {
      Tasks.loadAll().then((res) => context.commit("irs_record:set_tasks", res))
    },
    "irs_record:load_spatial_entities": (context) => {
      DB.spatial_entities.toArray().then((res) => context.commit("irs_record:set_spatial_entities", res))
    },

    "irs_record:seed_local_data_from_files": (context) => {
      const clusters = require('./_seed_data/clusters.json')
      const tasks = require('./_seed_data/tasks.json')
      const spatial_entities = require('./_seed_data/spatial_entities.json')

      context.dispatch("irs_record:save_local_clusters", clusters)
      context.dispatch("irs_record:save_local_tasks", tasks)
      context.dispatch("irs_record:save_local_spatial_entities", spatial_entities)
    },
    "irs_record:seed_local_data_from_remote": (context) => {
      context.dispatch("irs_record:get_remote_clusters")
        .then((res) => context.dispatch("irs_record:save_local_clusters", res.data))

      context.dispatch("irs_record:get_remote_tasks")
        .then((res) => context.dispatch("irs_record:save_local_tasks", res.data))

      context.dispatch("irs_record:get_remote_spatial_entities")
        .then((res) => context.dispatch("irs_record:save_local_spatial_entities", res.data))
    },
    "irs_record:clear_local_data": (context) => {
      DB.clusters.clear().then(DB.tasks.clear())
        .then(DB.spatial_entities.clear())
        .then(() => {
          context.commit("irs_record:set_clusters", null)
          context.commit("irs_record:set_tasks", null)
          context.commit("irs_record:set_spatial_entities", null)
        })
    },
    "irs_record:save_local_clusters": (context, clusters) => {
      if (!clusters) return
      DB.clusters.bulkAdd(clusters).then(res => context.commit("irs_record:set_clusters", clusters))
    },
    "irs_record:save_local_tasks": (context, tasks) => {
      if (!tasks) return
      DB.tasks.bulkAdd(tasks).then(res => context.commit("irs_record:set_tasks", tasks))
    },
    "irs_record:save_local_spatial_entities": (context, spatial_entities) => {
      if (!spatial_entities) return
      DB.spatial_entities.bulkAdd(spatial_entities).then(res => context.commit("irs_record:set_spatial_entities", spatial_entities))
    },




    "irs_record:update_active_task": (context, taskClone) => {
      delete taskClone.distance // TODO: @feature Maybe want to use this to validate proximity to structure when record created

      DB.tasks.update(taskClone.id, taskClone).then((res) => {
        context.commit("irs_record:update_task_state", taskClone)
        context.commit("irs_record:set_active_task", null)
      }).catch((error) => console.error(error))
    },


    // REMOTE DATA + DB
    "irs_record:search_remote_clusters": (context, locations) => {
      // req.params.filters.location = filters.location
      if (locations.length === 0) {
        return
      }

      const params = JSON.stringify(locations)
      const url = `${DOUMA_API_URL}/clusters?locations=${params}`
      console.log(url)

      return fetch(url)
        .then(res => res.json())
        .then(json => {
          const clusters_search_results = json.data
          return(clusters_search_results)
        })
    },
    "irs_record:get_remote_clusters": (context, ids) => {
      // req.params.filters.cluster_ids = filters.cluster_ids
      const params = JSON.stringify(ids)

      return fetch(`${DOUMA_API_URL}/clusters?ids=${params}`)
        .then(res => res.json())
    },
    "irs_record:get_remote_tasks": (context, task_ids) => {
      // req.params.filters.task_ids = filters.task_ids
      const params = JSON.stringify(task_ids)

      return fetch(`${DOUMA_API_URL}/tasks?ids=${params}`)
        .then(res => res.json())
    },
    "irs_record:get_remote_spatial_entities": (context, spatial_entity_ids) => {
      // req.params.filters.spatial_entity_ids = filters.spatial_entity_ids
      const params = JSON.stringify(spatial_entity_ids)

      return fetch(`${DOUMA_API_URL}/spatial_entities?ids=${params}`)
        .then(res => res.json())
    },
    "irs_record:get_matching_tasks_spatial_entities_for_clusters": (context, clusters) => {
      const tasks_params = clusters.reduce((prev, current)=> prev.concat(current.task_ids), [])
      const spatial_entity_params = clusters.reduce((prev, current)=> prev.concat(current.spatial_entity_ids), [])

      context.dispatch("irs_record:get_remote_tasks", tasks_params).then((res) => {
        console.table(res.data)
        context.dispatch("irs_record:save_local_tasks", res.data)
      })

      context.dispatch("irs_record:get_remote_spatial_entities", spatial_entity_params).then((res) => {
        console.table(res.data)
        context.dispatch("irs_record:save_local_spatial_entities", res.data)
      })

    },
    "irs_record:sync_local_tasks": (context, filters) => {
      console.log('GET REMOTE & RESOLVE CONFLICTS')
      context.dispatch("irs_record:get_remote_tasks")
        .then(context.dispatch("irs_record:post_local_tasks"))
    },


    // 
    // SYNC
    // 
    "irs_record:request_remote_tasks": (context) => {
      console.log('request_remote_tasks')
        // TODO: @debug Just need to return a Promise
      const promise = new Promise((resolve, reject) => resolve())
      return promise
    },
    "irs_record:send_local_tasks": (context) => {
      console.log('send_local_tasks')
    },






    "irs_record:deleteAllTasks": (context) => {
      // DB.tasks.list().then((res) => {
      //   // Delete all in parallel
      //   return Promise.all(res.data.map((task) => {
      //     return DB.tasks.delete(task.id)
      //   }))
      // }).then(() => {
      //   // Reset Tasks
      //   DB.tasks.list().then((res) => {
      //     context.commit("irs_record:setTasks", res.data)
      //   })
      // }).catch((error) => console.error(error))
    },
    "irs_record:finishTasks": (context) => {
      context.commit("irs_record:setSyncInProgress", true)

      context.dispatch("irs_record:sync").then(() => {
        context.commit("irs_record:reset")
        window.douma.data.irs_record.entities = []
        if (window.douma.data.irs_record.entitiesLayer) {
          window.douma.data.irs_record.entitiesLayer.remove()
          window.douma.data.irs_record.entitiesLayer = null
        }

        context.commit("irs_record:setSyncInProgress", false)
      })
    },

  }
}
