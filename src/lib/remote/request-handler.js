import axios from 'axios'
import {get} from 'lodash'

import CONFIG from 'config/common'
import {store} from 'apps/store'

// Create axios HTTP object

function config_axios_instance() {
  const HTTP = axios.create()

  HTTP.defaults.timeout = 10000

  HTTP.interceptors.response.use(function (response) {
    window.dispatchEvent(new Event('online'))
    return response
  }, function (error) {
    if (/timeout/.test(error.message)) {
      window.dispatchEvent(new Event('offline'))
    }
    return Promise.reject(error)
  })
  return HTTP
}

const HTTP = config_axios_instance()


/**
 * Standard handler for all remote requests (currently both client server and API)
 * Passed options overwrite any default options.
 * @param request
 */
export function request_handler(request) {
  if (!request) return Promise.reject(new Error("request is empty"))

  const personalised_instance_id = get(store, 'state.meta.personalised_instance_id')
  const country = get(store, 'state.instance_config.instance.slug')
  const api_key = get(store, 'state.meta.user.key')

  const default_options = {}

  if (!request.url) {
    if (!request.url_suffix) throw new Error("Missing `url_suffix` on request")
    const douma_api_root = `${CONFIG.api.url}/${CONFIG.api.version}`
    default_options.url = douma_api_root + request.url_suffix
  }

  default_options.params = {
    personalised_instance_id,
    country,
    instance_slug: country, // TODO: @refac remove 'country' property
  }

  default_options.headers = {
    'API-Key': api_key
  }

  const assigned_options = Object.assign(default_options, request)

  return HTTP(assigned_options)
    .then(json => json.data)
    .catch(err => {
      if (request.url_suffix !== '/login') {
        return store.commit('root:set_snackbar', {message: 'Current API key is not valid. Please log out and try to login again.'}, {root: true})
      }
    })
}



