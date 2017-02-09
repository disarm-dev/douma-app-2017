// Manages local DB calls

import DB from './db.js'


const clusters = {
  create: (clusters) => {
    return DB.clusters.bulkAdd(clusters)
  },
  read: () => {
    return DB.clusters.toArray()
  },
  delete: () => {},
  clear: () => {
    return DB.clusters.clear()
  }
}

const tasks = {
  create: (tasks) => {
    return DB.tasks.bulkAdd(tasks)
  },
  read_tasks: () => {},
  update_task: (task) => {},
  _delete_tasks: () => {},
  clear: () => {
    return DB.tasks.clear()
  }
}

const spatial_entities = {
  create: (spatial_entities) => {
    return DB.spatial_entities.bulkAdd(spatial_entities)
  },
  read_spatial_entities: () => {},
  _delete_spatial_entities: () => {},
  clear: () => {
    return DB.spatial_entities.clear()
  }
}


export default { clusters, tasks, spatial_entities }