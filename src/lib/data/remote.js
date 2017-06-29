import axios from 'axios'

import config from 'config/common_config.js'
import cache from 'config/cache'
import {InstanceConfigSchema} from '../models/instance_config.schema'

// Get basic root URL from static configuration
const douma_api_root = `${config.api.url}/${config.api.version}`

// Create axios HTTP object and the standard handler
const HTTP = axios.create()
HTTP.defaults.timeout = 5000
HTTP.interceptors.response.use(function (response) {
  window.dispatchEvent(new Event('online'))
  return response
}, function (error) {
  if (/timeout/.test(error.message)) {
    window.dispatchEvent(new Event('offline'))
  }
  return Promise.reject(error)
})

const standard_handler = (url, options = {}) => {
  options.url = url
  return HTTP(options)
    .then(json => json.data)
}



// Instance configuration and related files
export const get_instance_files = (slug) => {
  const urls = [
    `/static/instances/${slug}.instance.json`,
    `/static/instances/${slug}.form.json`,
    `/static/instances/${slug}.location_selector.json`,
  ]

  let options = {
    timeout: 20000
  }

  return Promise.all(urls.map(url => standard_handler(url, options)))
    .then(jsons => {
      const instance_config = jsons[0]
      const errors = InstanceConfigSchema.errors(instance_config)

      if (errors) {
        const message = "Invalid instance_config"
        console.error(errors)
        alert(message + ": Please report this as an urgent bug.")
        throw new Error(message)
      }

      const form = jsons[1]
      const location_selection = jsons[2]

      instance_config.form = form
      instance_config.location = location_selection

      return instance_config
    })

}


// User authentiction
export const authenticate = (user) => {
  let url = douma_api_root + `/auth`

  let options = {
    data: {user},
    method: 'post',
    timeout: 10000
  }
  return standard_handler(url, options)
}


// PLANS
export const get_current_plan = (country) => {
  let url = douma_api_root + `/plan/current?country=${country}`
  let options = {timeout: 10000}
  return standard_handler(url, options)
}

export const create_plan = (plan) => {
  let url = douma_api_root + `/plan/create`

  let options = {
    data: plan,
    method: 'post',
    timeout: 10000
  }

  return standard_handler(url, options)
}


// RECORDS
export const get_all_records = (country) => {
  let url = douma_api_root + `/record/all?country=${country}`

  return standard_handler(url)
}

export const create_records = (records) => {
  let url = douma_api_root + `/record/create_multiple`

  let options = {
    data: records,
    method: 'post'
  }

  return standard_handler(url, options)
}


/**
 * Sets `geodata` on the `cache` object, which can be imported anywhere.
 * If it doesn't already exist, will make remote request to load it.
 * ServiceWorker will then do its own caching.
 * @param store
 * @returns {*}
 */
export const get_geodata = (store) => {
  // Check if cache already populated
  if (cache.geodata.all_target_areas !== null && cache.geodata.clusters !== null) {
    // store.commit('root:set_loading', false)
    // store.commit('root:set_geodata_ready', true)
    console.warn("This nevers gets called")
    return Promise.resolve()
  }

  // Get slug and level
  const level = store.state.instance_config.spatial_hierarchy[0].name // This is top-level spatial_hierarchy
  const slug = store.state.instance_config.slug


  // $store is passed in order to update loading progress bar
  const urls = [
  `/static/geo/${slug}/spatial_hierarchy/${slug}.${level}.geojson`,
    `/static/geo/${slug}/spatial_hierarchy/${slug}.clusters.geojson`,
  ]

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

  store.commit('root:set_loading', true)

  return Promise.all(urls.map(url => standard_handler(url, options)))
    .then(jsons => {
      cache.geodata.all_target_areas = jsons[0]
      cache.geodata.clusters = jsons[1]
      store.commit('root:set_loading', false)
      store.commit('root:set_geodata_ready', true)
    })
    .catch(() => {
      store.commit('root:set_geodata_ready', 'error')
      store.commit('root:set_loading', false)
      store.commit('root:set_snackbar', {message: 'Network error. Please reload to try resuming.'})
    })
}

export const get_geodata_area = ({slug, level}) => {
  let url = `/static/geo/${slug}/spatial_hierarchy/${slug}.${level}.geojson`

  return standard_handler(url)
}
