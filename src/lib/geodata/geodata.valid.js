import has from 'lodash.has'

import {get_all_spatial_hierarchy_level_names} from 'lib/geodata/spatial_hierarchy_helper'
import cache from 'config/cache'
import geojson_validation from 'geojson-validation'

/**
 * @returns {boolean}
 */
function geodata_valid() {
  if (!Object.keys(cache.geodata).length) {
    // TODO: @feature Remove geodata console.logs
    console.warn('No spatial hierarchies on cache - need to (re-)load geodata')
    return false
  }

  const all_levels_present = geodata_has_all_levels()
  if (!all_levels_present) return false
  const is_valid_geojson = geodata_is_valid_geojson()
  if (!is_valid_geojson) return false

  check_geodata_features_not_zero_length()

  return all_levels_present && is_valid_geojson
}

/**
 * @returns {boolean}
 */
function geodata_has_all_levels() {
  const level_names = get_all_spatial_hierarchy_level_names()

  return level_names.every(level_name => {
    return geodata_has_level(level_name)
  })

}

function geodata_has_level(level_name) {
  return has(cache.geodata, level_name)
}

/**
 * @returns {boolean}
 */
function geodata_is_valid_geojson() {
  const level_names = get_all_spatial_hierarchy_level_names()

  return level_names.every(level_name => {
    return geojson_validation.valid(cache.geodata[level_name])
  })
}

function check_geodata_features_not_zero_length() {
  const level_names = get_all_spatial_hierarchy_level_names()

  return level_names.forEach(level_name => {
    if (cache.geodata[level_name].features && cache.geodata[level_name].features.length === 0) {
      console.warn(`${level_name} has no features`)
    }
  })
}

export {geodata_valid, geodata_has_all_levels, geodata_has_level}
