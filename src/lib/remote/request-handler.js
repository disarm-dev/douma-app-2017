import axios from 'axios'
import {get} from 'lodash'

import CONFIG from 'config/common'
import {store} from 'apps/store'

// Create axios HTTP object

function config_axios_instance() {
  const HTTP = axios.create()

  HTTP.defaults.timeout = 10000

  HTTP.interceptors.response.use(function (response) {
    store.commit('root:network_online', true)
    return response
  }, function (error) {
    if (/timeout/.test(error.message)) {
      store.commit('root:network_online', false)
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

  const personalised_instance_id = get(context.state, 'personalised_instance_id')
  const country = get(context.state, 'instance_config.instance.slug')
  const user = get(context.state, 'user.username')
  const user_token = 'IMPLEMENTATION still REQUIRED'

  const default_options = {}

  if (!request.url) {
    if (!request.url_suffix) throw new Error("Missing `url_suffix` on request")
    const douma_api_root = `${CONFIG.api.url}/${CONFIG.api.version}`
    default_options.url = douma_api_root + request.url_suffix
  }

  default_options.params = {
    personalised_instance_id,
    version_commit_hash_short,
    country,
    instance_slug: country, // TODO: @refac remove 'country' property
    user,
    user_token
  }

  const assigned_options = Object.assign(default_options, request)

  return HTTP(assigned_options)
    .then(json => json.data)

}



