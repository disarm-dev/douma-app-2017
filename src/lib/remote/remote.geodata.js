
import cache from 'config/cache'
import {standard_handler} from 'lib/remote/remote.standard-handler.js'
import {get_all_spatial_hierarchy_level_names, get_slug, get_data_version} from 'lib/geodata/spatial_hierarchy_helper'
import {decorate_level} from 'lib/geodata/geodata.decorate'

/**
 * Simple string-interpolation to generate a URL
 * @param slug
 * @param level_name
 * @returns {string}
 */
function geodata_url_for(level_name) {
  const slug = get_slug()
  return `/static/instances/${slug}/spatial_hierarchy/${slug}.${level_name}.geojson`
}

function get_geodata_for(level_name) {
  const data_version = get_data_version()

  const options = {
    timeout: 300000,
    params: {
      data_version,
    }
  }

  const url = geodata_url_for(level_name)
  return standard_handler(url, options)
}

function store_geodata(level_name, level_geodata) {
  cache[level_name] = level_geodata // WRONG. This should be writing to DB
  decorate_level(level_name) // this sets properties directly on cache
}

export function get_and_set_geodata_for(level_name) {
  return get_geodata_for(level_name)
    .then((level_geodata) => {
      store_geodata(level_name, level_geodata)
    })
    .catch(console.error)
}

export function get_and_set_all_geodata() {
  const levels = get_all_spatial_hierarchy_level_names()

  const promises = levels.map(get_and_set_all_geodata)

  return Promise.all(promises)
}
