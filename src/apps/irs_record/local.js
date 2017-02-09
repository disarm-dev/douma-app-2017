// Manages local DB calls

import DB from './db.js'


const clusters = {
  create_cluster: (cluster) => {},
  read_clusters: () => {},
  delete_clusters: () => {},
}

const tasks = {
  _create_tasks: (tasks) => {},
  read_tasks: () => {},
  update_task: (task) => {},
  _delete_tasks: () => {}
}

const spatial_entities = {
  _create_spatial_entities: () => {},
  read_spatial_entities: () => {},
  _delete_spatial_entities: () => {}
}


export default { clusters, tasks, spatial_entities }