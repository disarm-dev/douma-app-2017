import {standard_handler} from './remote.standard-handler.js'
import cache from 'config/cache'
import {get_all_spatial_hierarchy_levels} from 'lib/helpers/spatial_hierarchy_helper'

/**
 * Sets `geodata` on the `cache` object, which can be imported anywhere.
 * If it doesn't already exist, will make remote request to load it.
 * ServiceWorker will then do its own caching.
 * $store is passed in order to update loading progress bar
 * @param store
 * @returns {*}
 */
export const get_geodata = (store) => {
  store.commit('loading/LOAD', 'get_geodata')

  // Get slug and level
  const slug = store.state.instance_config.instance.slug
  const levels = get_all_spatial_hierarchy_levels()

  // Check if cache already populated
  if (Object.keys(cache.geodata).length !== 0) {
    store.commit('loading/END', 'get_geodata')
    store.commit('root:set_geodata_ready', true)
    return Promise.resolve()
  }

  // Build URLs for each level
  const urls = levels.map(level => {
      return `/static/instances/${slug}/spatial_hierarchy/${slug}.${level}.geojson`
  })

  let progress_cache = {}

  let options = {
    timeout: 300000,

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
      store.commit('loading/END', 'get_geodata')
      store.commit('root:set_geodata_ready', true)
    })
    .catch(() => {
      store.commit('root:set_geodata_ready', 'error')
      store.commit('loading/END', 'get_geodata')
      store.commit('root:set_snackbar', {message: 'Network error. Please reload to try resuming.'})
    })
}

