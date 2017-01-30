import turf from '@turf/turf'
import * as DB from '../../db.js'

export default {
  state: {
    actions: [],
    tasks: [],
    activeAction: null,
    aoi: null,
    syncInProgress: false
  },
  mutations: {
    "irs:setAoi": (state, aoi) => {
      state.aoi = aoi
    },
    "irs:setActions": (state, actions) => {
      state.actions = actions
    },
    "irs:setActiveTask": (state, action) => {
      state.activeAction = action
    },
    "irs:setTasks": (state, tasks) => {
      state.tasks = tasks
    },
    "irs:reset": (state) => {
      state.tasks = []
      state.actions = []
      state.activeAction = null
    },
    "irs:setSyncInProgress": (state, syncState) => {
      state.syncInProgress = !!(syncState)
    },
    "irs:updateTask": (state, task) => {
      let index = state.tasks.findIndex(t => t.id == task.id)
      state.tasks.splice(index, 1, task)
    }
  },
  actions: {
    "irs:buildTasks": (context) => {
      // TODO: @refac Could build the Tasks from Actions in either a Db or Model class, rather than here
      // TODO: @debug Actually need to load structures data, not just fake it
      const allEntities = require('../../data_bootstrap/structures.json').slice(0,50)
      const aoi = context.state.aoi

      DB.actions.list().then((result, error) => {
        // Filter Entities for AOI
        const entitiesInAoi = allEntities.filter((entity) => {
          return entity.properties.region == aoi
        })

        const entitiesInAoiOsmIds = entitiesInAoi.map(entity => entity.properties.osm_id)

        // Find Actions that match Entities in AOI
        const actionsInAoi = result.data.filter((action) => {
          return entitiesInAoiOsmIds.includes(action.osm_id)
        })

        // Build Tasks array, incl. empty Tasks for Entities without existing Actions
        const tasks = entitiesInAoi.map(entity => {
          // TODO: @feature Replace geospatial filter with much faster attribute-based filter
          const centroid = turf.centroid(entity.geometry)
          const relatedAction = actionsInAoi.find(action => action.osm_id === entity.properties.osm_id)

          if (relatedAction){
            relatedAction.centroid = centroid
            return relatedAction
          } else {
            return {
              osm_id: entity.properties.osm_id,
              actioned: 'unvisited',
              centroid: centroid
            }
          }
        })

        context.commit('irs:setTasks', tasks)
        // context.commit('irs:setActiveTask', null)
        
        // Store filtered Entities not in $store. Global anyone?
        window.douma.data.irs.entities = entitiesInAoi
        
      })
    },
    "irs:setActiveTaskByOSMId": (context, osm_id) => {
      let action = context.state.tasks.find(task => task.osm_id === osm_id)
      context.commit('irs:setActiveTask', action)
    },
    "irs:updateActiveAction": (context, taskClone) => {
      let existingTaskIndex = context.state.tasks.findIndex(task => task.osm_id === taskClone.osm_id)
      if (existingTaskIndex === -1) return

      context.state.activeAction = taskClone
      // TODO: @feature Maybe want to use this to validate proximity to structure when record created
      delete taskClone.distance

      // TODO: @feature Need to also persist to Kinto store somehow
      if (taskClone.id) {
        DB.actions.update(taskClone).then((res) => {
          context.state.tasks.splice(existingTaskIndex, 1, taskClone)
        })
      } else {
        DB.actions.create(taskClone).then((res) => {
          context.state.tasks.splice(existingTaskIndex, 1, taskClone)
        })
      }

      // TODO @fix Replace magic number with proper solution
      setTimeout(() => {
        context.commit("irs:setActiveTask", null)
      }, 100)
    },
    "irs:sync": (context) => {
      context.commit("irs:setSyncInProgress", true)
      return new Promise((resolve, reject) => {
        DB.actions.sync(DB.syncOptions).then(r => {
        DB.actions
          .list()
          .then( (res) => {
            context.commit('irs:setActions', res.data)
            context.commit("irs:setSyncInProgress", false)
            resolve("synced")
          })
        })
      }) 
    },
    "irs:deleteAllActions": (context) => {
      DB.actions.list().then((res) => {
        // Delete all in parallel
        return Promise.all(res.data.map((action) => {
          return DB.actions.delete(action.id)
        }))
      }).then(() => {
        // Reset Actions
        DB.actions.list().then((res) => {
          context.commit("irs:setActions", res.data)
        })
      }).catch((error) => console.error(error))
    },
    "irs:finishTasks": (context) => {
      context.commit("irs:setSyncInProgress", true)

      context.dispatch("irs:sync").then(() => {
        context.commit("irs:reset")
        window.douma.data.irs.entities = []
        if (window.douma.data.irs.entitiesLayer) {
          window.douma.data.irs.entitiesLayer.remove()
          window.douma.data.irs.entitiesLayer = null
        }

        context.commit("irs:setSyncInProgress", false)
      })
    },
    "irs:createTask": (context, task) => {
      DB.actions.create(task).then(() => {
        context.state.tasks.push(task)
      })      
    },
    "irs:updateTask": (context, task) => {
      context.commit("irs:updateTask", task)
    },
    "irs:deleteTask": (context, task) => {
      let index = context.state.tasks.findIndex(t => t.id == task.id)
      context.state.tasks.splice(index, 1)
    },
  }
}


// TODO: @feature Do we need a function that returns colours from text - e.g. for charts, etc?
// e.g. 'visited' => #70b170