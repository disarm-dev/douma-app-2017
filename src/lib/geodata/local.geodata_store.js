import dexie from 'dexie'

const db = new Dexie('disarm_geodata')
const disarm_geodata_key = 'disarm_geodata_key'

db.version(1).stores({
  geodata_collection: `disarm_geodata_key`
})

export function save_geodata_to_idb(geodata) {
  const record = {
    disarm_geodata_key,
    geodata
  }
  return db.geodata_collection.put(record)
}

export function retrieve_geodata_from_idb() {
  return db.geodata_collection.get({disarm_geodata_key})
}
