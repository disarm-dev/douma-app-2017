import has from 'lodash.has'
import {get, uniq} from 'lodash'

import {get_all_spatial_hierarchy_level_names, get_data_version} from 'lib/instance_data/spatial_hierarchy_helper'
import cache from 'config/cache'
import geojson_validation from 'geojson-validation'
import {versions_match} from "lib/models/geodata/geodata.versions"

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
    
  if (geodata_outdated()) {
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

function geodata_level_version_matches_instance_config(level_name) {
  // TODO: @feature Use the geodata from the store, not cache
  // const version_from_idb = get(store.state.meta.geodata, `${level_name}._version`, null)
  const version_from_idb = get(cache.geodata, `${level_name}._version`, null)


  const version_from_instance_config = get_data_version(level_name)

  return versions_match(version_from_idb, version_from_instance_config)
}


function geodata_outdated (geodata, required_version) {
  const levels = Object.keys(geodata)

  return levels.every(level_name => {
    const level = geodata[level_name]
    const level_version = get(level, '_version', null)
    return versions_match(level_version, required_version)
  })
}

export {geodata_in_cache_and_valid, geodata_has_all_levels, geodata_has_level, geodata_outdated, geodata_level_version_matches_instance_config}
