import Dexie from 'dexie';

const DB = new Dexie('irs_progress');

// Create stores for each collection, including setting primary key.
DB.version(1).stores({
  clusters: 'id', 
  tasks: 'id', 
  spatial_entities: 'id'
})

export default DB