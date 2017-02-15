// Called by $store, coordinates local and remote activity
import LocalDB from './local.js'
import RemoteDBClass from './remote.js'

class Sync {

  config(team_id) {
    this.RemoteDB = new RemoteDBClass(team_id)
    this.team_id = team_id
  }

  // Search
  search_clusters(locations) {
    if (locations.length === 0) {
      throw new Error("No locations provided for search")
    }

   return this.RemoteDB.read_clusters({locations}) // returns a promise
  }
  
  // Cluster management (incl. Task sync)
  open_clusters(clusters) {
    // For each Cluster already in memory
    // Get related RemoteRB Tasks
    // Add Tasks as property to Cluster
    // For each Task
    // Get related SpatialEntities
    // Add each SpatialEntities as property on relevant Task
    // Create Clusters in LocalDB
    // Return Clusters for $store to set on $store.state

    const clusters_promise = LocalDB.clusters.create(clusters)


    const task_promises = clusters.map((cluster) => {
      return new Promise((resolve, reject) => {
        console.log('cluster.task_ids')
        console.log(cluster.task_ids)
        this.RemoteDB.read_tasks(cluster.task_ids)
        .then(res => {
          res = res.map(task => {
            task._sync_status = 'synced'
            return task
          })
          LocalDB.tasks.create(res)
        })
        .then((res) => resolve(res))
        .catch(error => reject(error))
      })
    })

    const spatial_entity_promises = clusters.map((cluster) => {
      return new Promise((resolve, reject) => {
        console.log('cluster.spatial_entity_ids')
        console.log(cluster.spatial_entity_ids)
        this.RemoteDB.read_spatial_entities(cluster.spatial_entity_ids)
        .then(res => LocalDB.spatial_entities.create(res))
        .then((res) => resolve(res))
        .catch(error => reject(error))
      })
    })

    const all_promises = [].concat(
      clusters_promise, task_promises, spatial_entity_promises
    )
    console.log('all_promises')
    console.log(all_promises)

    return Promise.all(all_promises)

    // if all Tasks successfully found in RemoteRB AND stored in LocalDB
    // if all SpatialEntities successfully found in RemoteRB AND stored in LocalDB
    // resolve()
  }
  close_clusters(clusters) {
        
  }
  
  // Update task
  update_task(task) {
    return LocalDB.tasks.update(task)
  }
  
  // Get Tasks and SpatialEntities for a Cluster
  tasks_for_cluster(cluster_id) {
    
  }

  // Setting initial state for views
  read_local_clusters() {
    return LocalDB.clusters.read()
  }

  get_tasks_for_cluster(cluster) {
    return new Promise((resolve, reject) => {
      const task_ids = cluster.task_ids
      const spatial_entity_ids = cluster.spatial_entity_ids

      Promise.all([
        LocalDB.tasks.read(task_ids),
        LocalDB.spatial_entities.read(spatial_entity_ids)
      ]).then((result_array) => {
        const results = {tasks: result_array[0], spatial_entities: result_array[1]}
        const joinedTasks = results.tasks.map((task) => {
          return {
            ...task,
            spatial_entity: results.spatial_entities.find(s => s._id === task.spatial_entity_id)
          }
        })
        resolve(joinedTasks)
      })

    })
  }

  // Clear DBs - for reset and debugging
  clear_local_dbs() {
    const promises = [
      LocalDB.clusters.clear(),
      LocalDB.tasks.clear(),
      LocalDB.spatial_entities.clear(),
    ]
    return Promise.all(promises)
  }
}

export default new Sync()