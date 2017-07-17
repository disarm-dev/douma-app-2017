import has from 'lodash.has'
import is_empty from 'lodash.isempty'

import {get_all_spatial_hierarchy_level_names} from 'lib/geodata/spatial_hierarchy_helper'
import cache from 'config/cache'

/**
 *
 * @returns {boolean}
 */
const geodata_valid = () => {

  if (!has(cache, 'geodata')) {
    console.error('No geodata on cache - need to (re-)load geodata')
    return false
  }

  return is_empty(geodata_missing_fields())
}

const geodata_missing_fields = () => {
  const level_names = get_all_spatial_hierarchy_level_names()

  return level_names.filter(level_name => {
    return !has(cache.geodata, level_name)
  })

}

export {geodata_valid, geodata_missing_fields}
