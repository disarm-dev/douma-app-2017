import Dexie from 'dexie';

const DB = new Dexie('irs');

// Create stores for each collection, including setting primary key.
DB.version(1).stores({
  clusters: '_id',
  tasks: '_id',
  spatial_entities: '_id'
})

DB.version(2).stores({
  clusters: '_id,spray_team_id',
  tasks: '_id',
  spatial_entities: '_id'
})

DB.version(3).stores({
  clusters: '_id,spray_team_id,demo_instance_id',
  tasks: '_id',
  spatial_entities: '_id'
})

export default DB