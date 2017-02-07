import Dexie from 'dexie';

const db = new Dexie('irs_progress');
db.version(1).stores({
  clusters: 'id', 
  tasks: 'id', 
  spatial_entities: 'id'
})

const clusters = db.clusters
const tasks = db.tasks
const spatial_entities = db.spatial_entities


window.DB = {
  clusters, tasks, spatial_entities
}

export {
  clusters, tasks, spatial_entities
}