import Dexie from 'dexie';

const DB = new Dexie('irs_progress');
DB.version(1).stores({
  clusters: 'id', 
  tasks: 'id', 
  spatial_entities: 'id'
})

const clusters = DB.clusters
const tasks = DB.tasks
const spatial_entities = DB.spatial_entities


window.DB = {
  clusters, tasks, spatial_entities
}

export {
  DB
}