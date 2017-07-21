import axios from 'axios'
import get from 'lodash.get'

import CONFIG from 'config/common'

let store

const configure_standard_handler = (app_store) => {
  store = app_store
}

// Create axios HTTP object
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

/**
 * Standard handler for all remote requests (currently both client server and API)
 * @param url
 * @param options
 */
const standard_handler = (url, options = {}) => {
  // TODO: @feature Need to check user has permission. Or do we do this on the API side?
  // Or are both equally easy to fool?...

  const personalised_instance_id = get(store, 'state.meta.personalised_instance_id')
  const version_commit_hash_short = VERSION_COMMIT_HASH_SHORT
  const country = get(store, 'state.instance_config.instance.slug')
  const user = get(store, 'state.meta.user.username')
  const user_token = 'WE DONT HAVE TOKENS YET'

  options.url = url
  options.params = {
    ...options.params,
    personalised_instance_id,
    version_commit_hash_short,
    country,
    instance_slug: country, // TODO: @refac remove 'country' property
    user,
    user_token
  }

  return HTTP(options)
    .then(json => json.data)
}

// Get basic root URL from static configuration
const douma_api_root = `${CONFIG.api.url}/${CONFIG.api.version}`
// const douma_api_root = `http://localhost:3000/${CONFIG.api.version}`

const try_reconnect = () => {
  return standard_handler(CONFIG.api.url)
}

const get_version = () => {
  const options = {
    timeout: 2000
  }
  return standard_handler('/VERSION', options)
}

export {configure_standard_handler, standard_handler, douma_api_root, try_reconnect, get_version}



