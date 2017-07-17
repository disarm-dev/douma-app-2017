import has from 'lodash.has'

import {get_all_spatial_hierarchy_level_names} from 'lib/geodata/spatial_hierarchy_helper'
import cache from 'config/cache'

/**
 *
 * @returns {boolean}
 */
const geodata_valid = () => {
  const level_names = get_all_spatial_hierarchy_level_names()

  if (!has(cache, 'geodata')) {
    console.error('No geodata on cache - need to (re-)load geodata')
    return false
  }

  for(const level_name of level_names) {
    if (!has(cache.geodata, level_name)) {
      console.error(`Geodata missing level ${level_name}`)
      return false
    }
  }

  return true
}

export {geodata_valid}
