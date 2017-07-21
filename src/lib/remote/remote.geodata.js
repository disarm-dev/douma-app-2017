/**
 * Sets `geodata` on the `cache` object, which can be imported anywhere.
 * If it doesn't already exist, will make remote request to load it.
 * ServiceWorker will then do its own caching.
 * $store is passed in order to update loading progress bar
 * @param store
 * @returns {*}
 */
import cache from 'config/cache'
import {standard_handler} from 'lib/remote/remote.standard-handler.js'
import {get_all_spatial_hierarchy_level_names, get_data_version} from 'lib/geodata/spatial_hierarchy_helper'
import {geodata_valid, geodata_missing_fields} from 'lib/geodata/geodata.valid'
import {decorate_geodata_on_cache} from 'lib/geodata/geodata.decorate'

export const get_geodata = (store, force_reload = false) => {
  store.commit('loading/LOAD', 'get_geodata')

  // Get slug and level
  const slug = store.state.instance_config.instance.slug
  const levels = get_all_spatial_hierarchy_level_names()

  // Check if cache already populated
  if (force_reload === false && geodata_valid()) {
    store.commit('loading/END', 'get_geodata')
    store.commit('root:set_geodata_ready', true)
    return Promise.resolve()
  }

  // Build URLs for each level
  const urls = levels.map(level => {
      return `/static/instances/${slug}/spatial_hierarchy/${slug}.${level}.geojson`
  })

  let progress_cache = {}

  const data_version = get_data_version()
  const instance_slug =  store.state.instance_config.instance.slug

  let options = {
    timeout: 300000,
    params:{
      data_version,
      instance_slug
    },

    // Calculate progress
    onDownloadProgress: (progress) => {
      const key = progress.target.responseURL

      if (!progress_cache[key]) {
        progress_cache[key] = {
          loaded: progress.loaded,
          total: progress.total
        }
      } else {
        progress_cache[key].loaded = progress.loaded
      }

      const loaded_bytes_all = Object.keys(progress_cache).reduce((sum, cache_url) => {
        return progress_cache[cache_url].loaded + sum
      }, 0)

      const total_all_files = Object.keys(progress_cache).reduce((sum, cache_url) => {
        return progress_cache[cache_url].total + sum
      }, 0)

      const progress_calc = (loaded_bytes_all / total_all_files) * 100

      store.commit('root:set_geodata_loading_progress', progress_calc)
    }
  }

  return Promise.all(urls.map(url => standard_handler(url, options)))
    .then(geodata_json => {

      levels.forEach((level, index) => {
        cache.geodata[level] = geodata_json[index]
      })

      decorate_geodata_on_cache()

      if (!geodata_valid()) console.error('Missing geodata fields:', geodata_missing_fields())

      store.commit('loading/END', 'get_geodata')
      store.commit('root:set_geodata_ready', true)
    })
    .catch(() => {
      store.commit('root:set_geodata_ready', 'error')
      store.commit('loading/END', 'get_geodata')
      store.commit('root:set_snackbar', {message: 'Network error. Please reload to try resuming.'})
    })
}

