import Dexie from 'dexie';

const DB = new Dexie('irs_dashboard');

// Create stores for each collection, including setting primary key.
DB.version(1).stores({
  clusters: '_id',
  tasks: '_id',
})

export default DB