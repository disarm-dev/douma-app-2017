import has from 'lodash.has'
import {get} from 'lodash'

import {get_all_spatial_hierarchy_level_names, get_data_version} from 'lib/instance_data/spatial_hierarchy_helper'
import cache from 'config/cache'
import geojson_validation from 'geojson-validation'

/**
 * @returns {boolean}
 */
function geodata_in_cache_and_valid() {
  if (!Object.keys(cache.geodata).length) {
    return false
  }

  const all_levels_present = geodata_has_all_levels()
  if (!all_levels_present) return false
  const is_valid_geojson = geodata_is_valid_geojson()
  if (!is_valid_geojson) return false
    
  const is_latest_version = geodata_is_latest_version()
  if (!is_latest_version) return false

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

function geodata_is_latest_version () {
  const version_from_instance_config = get_data_version()
  const version_from_idb = get(cache.geodata, '_version')
  const is_latest_version = version_from_idb >= version_from_instance_config

  console.log('geodata_is_latest_version', is_latest_version)
  console.log('get(cache.geodata, \'_version\')', get(cache.geodata, '_version'))
  console.log('get_data_version()', get_data_version())
  return is_latest_version
}

export {geodata_in_cache_and_valid, geodata_has_all_levels, geodata_has_level, geodata_is_latest_version}
