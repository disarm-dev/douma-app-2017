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
  if (!is_latest_version) {
    console.log('Not on latest geodata version')
    return false
  }

  // This logs a warning if the geodata is empty
  check_geodata_features_not_zero_length()

  // All other checks return false, so return true here
  return true
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

  level_names.forEach(level_name => {
    if (cache.geodata[level_name].features && cache.geodata[level_name].features.length === 0) {
      console.warn(`${level_name} has no features`)
    }
  })
}

function geodata_level_is_latest_version(level_name) {
  const version_from_instance_config = get_data_version()

  const version_from_idb = get(cache.geodata, `${level_name}._version`, null)

  if (!version_from_idb) {
    // has no _version on it, so not latest version
    return false
  }

  if (!version_from_instance_config) {
    return false
  }

  if (version_from_instance_config == version_from_idb) {
    // versions are the same
    return true
  }

  if (version_from_idb < version_from_instance_config) {
    // database version is lower than instance_config
    // So not latest version
    return false
  }

  console.log("Don't know what to do here, shouldn't happen")
}


function geodata_is_latest_version () {
  const version_from_instance_config = get_data_version()

  if (!version_from_instance_config) {
    // If we can't get a data version from the instance_config
    // then we are not on the latest version
    return false
  }

  const version_from_idb = get(cache.geodata, '_version', null)

  if (!version_from_idb) {
    // If we can't get a data version from the database
    // then we are not on the latest version
    return false
  }

  if (version_from_idb == version_from_instance_config) {
    // The versions are the same,
    // We are on the latest version
    return true
  }

  if (version_from_idb < version_from_instance_config) {
    // The database version is lower than the instance_config
    // We are not on the latest version and need to update
    return false

  }

  console.log("Don't know what to do here, shouldn't happen")
}

export {geodata_in_cache_and_valid, geodata_has_all_levels, geodata_has_level, geodata_is_latest_version, geodata_level_is_latest_version}
