// Called by $store, coordinates local and remote activity
import LocalDB from '../../lib/local.js'
import RemoteDBClass from '../../lib/remote.js'
import flatten from 'array-flatten'

class Sync {
  constructor() {
    const demo_instance_id = JSON.parse(localStorage.getItem('douma-demo-instance-id'))
    this.RemoteDB = new RemoteDBClass(demo_instance_id)
  }

  config(demo_instance_id) {
    this.RemoteDB = new RemoteDBClass(demo_instance_id)
    this.demo_instance_id = demo_instance_id
  }

  // Search
  search_clusters(locations) {
    let filters = {}

    if (locations.length) {
      filters.locations = locations
    }

    return this.RemoteDB.read_clusters(filters) // returns a promise
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
    let cluster_ids = clusters.map(c => c.properties.cluster_id)

    this.RemoteDB.get_tasks_for_cluster_ids(cluster_ids).then((cluster_tasks) => {
      console.log(cluster_ids)
      console.log(cluster_tasks)
      return 

      let task_ids = []
      let spatial_entity_ids = []

      clusters.map(cluster => {
        task_ids.push(cluster.properties.task_ids)
        spatial_entity_ids.push(cluster.properties.spatial_entity_ids)
      })

      task_ids = flatten(task_ids)
      spatial_entity_ids = flatten(spatial_entity_ids)
      const task_promise = new Promise((resolve, reject) => {
        this.RemoteDB.read_tasks({task_ids})
        .then(res => {
          res = res.map(task => {
            task._sync_status = 'synced'
            return task
          })
          return LocalDB.tasks.create(res)
        })
        .then((res) => resolve(res))
        .catch(error => {
          resolve()
        })
      })

      const spatial_entity_promise = new Promise((resolve, reject) => {
        this.RemoteDB.read_spatial_entities({spatial_entity_ids})
        .then(res => {
          return LocalDB.spatial_entities.create(res)
        })
        .then((res) => resolve(res))
        .catch(error => {
          resolve()
        })
      })



      return Promise.all([task_promise, spatial_entity_promise])
        .then((res) => {
          const existing_ids = (JSON.parse(localStorage.getItem('douma-saved-cluster-ids'))|| [])
          const saved_cluster_ids = clusters.map(cluster => cluster._id).concat(existing_ids)
          localStorage.setItem('douma-saved-cluster-ids', JSON.stringify(saved_cluster_ids))
          return res
        })

    })
  }

  // DONE
  close_cluster(cluster) {     
    return this.get_unsynced_tasks_for_cluster(cluster).then(({cluster_id, unsynced_tasks}) => {
      if (unsynced_tasks.length === 0 ) {
        const cluster_promise = LocalDB.clusters.delete(cluster)

        const task_promises = LocalDB.tasks.delete(unsynced_tasks)

        // TODO: @feature delete spatial entities on close
        // const spatial_entity_promises = LocalDB.spatial_entities.delete()

        const all_promises = [].concat(
          cluster_promise, task_promises //, spatial_entity_promises
        )

        return Promise.all(all_promises)
      } else {
        throw new Error('Big problem! trying to close cluster with unsynced tasks')  
      }
    })
  }
  
  // Update task
  update_task(task) {
    return LocalDB.tasks.update(task)
  }

  get_tasks_for_cluster(cluster) {
    return new Promise((resolve, reject) => {
      const task_ids = cluster.properties.task_ids
      const spatial_entity_ids = cluster.properties.spatial_entity_ids

      Promise.all([
        LocalDB.tasks.read(task_ids),
        LocalDB.spatial_entities.read(spatial_entity_ids)
      ]).then((result_array) => {
        const results = {tasks: result_array[0], spatial_entities: result_array[1]}
        const joinedTasks = results.tasks.map((task) => {
          return {
            ...task,
            spatial_entity: results.spatial_entities.find(s => s.properties.osm_id === task.spatial_entity_id)
          }
        })
        resolve(joinedTasks)
      })

    })
  }

  get_proportion_visited_for_cluster(cluster){
    this.get_tasks_for_cluster(cluster)
      .then((res) => {
        const tasks_count = res.length
        const visited_count = res.filter((r) => {
          return r.properties.status !== 'unvisited'
        }).length
        return visited_count/tasks_count
      })
  }

  get_unsynced_tasks_for_cluster(cluster){
    return new Promise((resolve, reject) => {
      this.get_tasks_for_cluster(cluster)
        .then((res) => {
          const tasks = res.filter((r) => {
            return r._sync_status !== 'synced'
          })
          resolve({cluster_id: cluster._id, unsynced_tasks: tasks})
        })
    })
  }
  
  // Sync local and remote
  sync_tasks(tasks){
    return this.RemoteDB.update_tasks(tasks)
    .then((response) => {
      console.log('sync_tasks response', response)
      
      let modified_tasks = tasks.filter((task) => {
        return response.modified.includes(task._id)
      }).map((task) => {
        task._sync_status = 'synced'
        return task
      })

      return LocalDB.tasks.bulk_update(modified_tasks)
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