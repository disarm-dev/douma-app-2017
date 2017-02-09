// Manages remote DB calls

const clusters = {
  read_clusters: (cluster_ids) => {}
}

const tasks = {
  read_tasks: (task_ids) => {},
  update_task: (task) => {}
}

const spatial_entities = {
  read_spatial_entities: () => {}
}


export default { clusters, tasks, spatial_entities }