import Dexie from 'dexie'

import cache from 'config/cache'
import {decorate_geodata_on_cache} from 'lib/models/geodata/geodata.decorate'
import {get_data_version} from "lib/instance_data/spatial_hierarchy_helper"

const db = new Dexie('disarm_geodata')
const disarm_geodata_key = 'disarm_geodata_key'

db.version(1).stores({
  geodata_collection: `disarm_geodata_key, geodata` // geodata_collection has two columns, called 'disarm_geodata_key' and 'geodata'
})

/**
 * Save the result of remote.geodata getting straight into IDB
 * @param level_name
 * @param level_geodata
 * @returns {Promise.<void>}
 */
export async function save_geodata_to_idb({level_name, level_geodata}) {
  const existing_record = await retrieve_geodata_from_idb()

  if (!existing_record) {
    const new_record = {
      disarm_geodata_key,
      geodata: {
        _version: get_data_version(),
        [level_name]: level_geodata
      }
    }
    console.log('put', new_record)
    return db.geodata_collection.put(new_record)
  } else {
    const updated_record = {
      disarm_geodata_key,
      geodata: {
        ...existing_record.geodata,
        ...{
          [level_name]: level_geodata
        },
        _version: get_data_version()
      }
    }
    console.log('update', level_geodata)
    return db.geodata_collection.update(disarm_geodata_key, updated_record)
  }
}



function retrieve_geodata_from_idb() {
  return db.geodata_collection.get(disarm_geodata_key)
}

/**
 * Try to retrieve geodata from IDB, and set on cache if it exists
 */
export function hydrate_geodata_cache_from_idb() {
  return retrieve_geodata_from_idb()
    .then((geodata) => {
      if (geodata) {
        cache.geodata = geodata.geodata
        decorate_geodata_on_cache()
      }
      return geodata
    })
}
