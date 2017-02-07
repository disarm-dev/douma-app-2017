import Dexie from 'dexie';

const DB = new Dexie('irs_progress');
DB.version(1).stores({
  clusters: 'id', 
  tasks: 'id', 
  spatial_entities: 'id'
})

window.db = DB

export default DB