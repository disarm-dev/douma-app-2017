import RxDB from 'rxdb'
import PouchIDB from 'pouchdb-adapter-leveldb'

RxDB.plugin(PouchIDB)

const Records_db = await RxDB.create({
  name: 'recordsdb',      // <- name
  adapter: 'idb'          // <- storage-adapter
});

// create local DB
// apply schema to local DB
// add version-migrations as required

export async function create_record_local(record) {
  await Records_db.inserts(record)
}

export async function get_records_local() {
  const query = {}
  const records = await Records_db.find(query).exec()
  return records
}

export async function update_record_as_synced(id) {
  const found_record = Records_db.findOne(id)

  found_record.set('synced', true)

  await found_record.save()
}
