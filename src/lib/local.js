// Manages local DB calls

import DB from './db.js'

const clusters = {
  create: (clusters) => {
    return DB.clusters.bulkAdd(clusters)
  },
  read: ({spray_team_id}) => {
    if (spray_team_id) {
      console.log(spray_team_id)
      return DB.clusters.where({spray_team_id}).toArray()
      // return DB.clusters.toArray()
    } else {
      return DB.clusters.toArray()
    }
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