import Dexie from 'dexie';

const DB = new Dexie('irs_tasker');

// Create stores for each collection, including setting primary key.
DB.version(1).stores({
  clusters: '_id',
})

export default DB