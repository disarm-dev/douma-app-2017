// Manages local DB calls

import DB from './db.js'
window.DB = DB

const clusters = {
  create: (clusters) => {
    return DB.clusters.bulkAdd(clusters)
  },
  read: (options) => {
    if (Object.keys(options).length !== 0) {
      return DB.clusters.where(options).toArray()
    } else {
      return DB.clusters.toArray()
    }
  },
  update: (cluster) => {
    return DB.clusters.update(cluster._id, cluster)
  },
  delete: (cluster) => {
    return DB.clusters.delete(cluster._id)
  },
  clear: () => {
    return DB.clusters.clear()
  }
}

const tasks = {
  create: (tasks) => {
    return DB.tasks.bulkAdd(tasks)
  },
  read: (ids) => {
    return DB.tasks.filter((task) => {
      return ids.includes(task._id)
    }).toArray()
  },
  update: (task) => {
    return DB.tasks.update(task._id, task)
  },
  bulk_update: (tasks) => {
    return DB.tasks.bulkPut(tasks)
  },
  delete: (tasks) => {
    let ids = tasks.map(t => t._id) 
    return DB.tasks.bulkDelete(ids)
  },
  clear: () => {
    return DB.tasks.clear()
  }
}

const spatial_entities = {
  create: (spatial_entities) => {
    return DB.spatial_entities.bulkAdd(spatial_entities)
  },
  read: (ids) => {
    return DB.spatial_entities.filter((spatial_entity) => {
      return ids.includes(spatial_entity.properties.osm_id)
    }).toArray()
  },
  delete: (spatial_entities) => {
    let ids = spatial_entities.map(s => s._id) 
    return DB.spatial_entities.bulkDelete(ids)
  },
  clear: () => {
    return DB.spatial_entities.clear()
  }
}


export default { clusters, tasks, spatial_entities }