import Dexie from 'dexie';

const DB = new Dexie('irs_record');

// Create stores for each collection, including setting primary key.
DB.version(1).stores({
  clusters: '_id',
  tasks: '_id',
  spatial_entities: '_id'
})

export default DB