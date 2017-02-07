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
    "irs_progress:updateTaskState": (state, task) => { // For the map?
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
    // 
    // LOCAL DB
    // 

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

    // 
    // REMOTE DB
    // 
    // searchClusters -> get selected fields for Clusters
    // getClustersFromRemote -> 
    



    // "irs_progress:searchClusters": (context, searchObject) => {
    // },
    "irs_progress:retrieveClusters": (context) => {
      // DB.clusters
      //   .list()
      //   .then((result) => {
      //     context.commit('irs_progress:setClusters', result.data)
      //   })
    },
    "irs_progress:retrieveStructures": (context) => {
      // DB.structures
      //   // .sync()
      //   // .then(() => DB.structures.list())
      //   .list()
      //   .then((result) => {
      //     context.commit('irs_progress:setStructures', result.data)
      //   })
    },
    "irs_progress:retrieveTasks": (context) => {
      // DB.tasks
      //   // .sync()
      //   // .then(() => DB.tasks.list())
      //   .list()
      //   .then((result) => {
      //     context.commit('irs_progress:setTasks', result.data)
      //   })
    },
    "irs_progress:buildTasks": (context) => {
      // Aim is to set $state.irs_progress.tasks with 
      // 1) only Tasks relevant to the AOI, and
      // 2) no Entities in AOI without a Task 

      const allEntities = require('../../data_bootstrap/structures.json').slice(0,10)

      // TODO: @refac Could build the Tasks in either a Db or Model class, rather than here
      // TODO: @debug Actually need to load structures data, not just fake it
      const aoi = context.state.aoi

      // DB.tasks.sync().then(() => {
      //   console.log('syncing...')
      //   return DB.tasks.list()
      // }).then((result) => {
      //   console.log('...syncing TASKS done')
      //   // Filter Entities for AOI
      //   const entitiesInAoi = allEntities.filter((entity) => {
      //     return entity.properties.region == aoi
      //   })

      //   const entitiesInAoiOsmIds = entitiesInAoi.map(entity => entity.properties.osm_id)

      //   // Find Tasks that match Entities in AOI
      //   const tasksInAoi = result.data.filter((task) => {
      //     return entitiesInAoiOsmIds.includes(task.osm_id)
      //   })

      //   // Build Tasks array, incl. empty Tasks for Entities without existing Actions
      //   let tasksExisting = []
      //   let tasksToCreate = []

      //   entitiesInAoi.forEach(entity => {
      //     // TODO: @feature Replace geospatial filter with much faster attribute-based filter
      //     const centroid = turf.centroid(entity.geometry)
      //     const relatedTask = tasksInAoi.find(task => task.osm_id === entity.properties.osm_id)

      //     if (relatedTask){
      //       relatedTask.centroid = centroid
      //       tasksExisting.push(relatedTask)
      //     } else {
      //       tasksToCreate.push(
      //         DB.tasks.create({
      //           osm_id: entity.properties.osm_id,
      //           actioned: 'unvisited',
      //           centroid: centroid
      //         })
      //       )
      //     }
      //   })

      //   Promise.all(tasksToCreate).then((res) => {
      //     console.log(res)
      //     const tasksFromPromises = res.map((r) => r.data)
      //     const tasks = tasksExisting.concat(tasksFromPromises)
      //     context.commit('irs_progress:setTasks', tasks)
          
      //     // Store filtered Entities not in $store. Global anyone?
      //     window.douma.data.irs_progress.entities = entitiesInAoi
      //   })

        
      // })
    },
    "irs_progress:set_active_task_by_osm_id": (context, osm_id) => {
      // TODO: @check Do this `find` on the $store rather than DB?
      let foundTask = context.state.tasks.find(task => task.osm_id === osm_id)
      context.commit('irs_progress:set_active_task', foundTask)
    },


    "irs_progress:sync": (context) => {
      // context.commit("irs_progress:setSyncInProgress", true)
      // return new Promise((resolve, reject) => {
      //   DB.tasks.sync().then(r => {
      //   DB.tasks
      //     .list()
      //     .then( (res) => {
      //       context.commit('irs_progress:setTasks', res.data)
      //       context.commit("irs_progress:setSyncInProgress", false)
      //       resolve("synced")
      //     })
      //   })
      // }).catch( () => context.commit("irs_progress:setSyncInProgress", false) )
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
    "irs_progress:updateActiveTask": (context, taskClone) => {
      delete taskClone.distance // TODO: @feature Maybe want to use this to validate proximity to structure when record created

      // DB.tasks.update(taskClone).then((res) => {
      //   context.commit("irs_progress:updateTaskState", res.data)
      //   context.commit("irs_progress:set_active_task", null)
      // }).catch((error) => console.error(error))
    },
  }
}


// TODO: @feature Do we need a function that returns colours from text - e.g. for charts, etc?
// e.g. 'visited' => #70b170