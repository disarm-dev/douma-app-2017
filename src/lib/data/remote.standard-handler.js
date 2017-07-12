import axios from 'axios'
import get from 'lodash.get'

import common_config from 'config/common_config'

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


const standard_handler = (url, options = {}) => {
  // TODO: @feature Need to check user has permission. Or do we do this on the API side?
  // Or are both equally easy to fool?...

  const personalised_instance_id = get(store, 'state.meta.personalised_instance_id')
  const commit_hash_short = COMMIT_HASH_SHORT
  const country = get(store, 'state.instance_config.instance.slug')
  const user = get(store, 'state.meta.user.username')
  const user_token = 'WE DONT HAVE TOKENS YET'

  options.url = url
  options.params = {
    ...options.params,
    personalised_instance_id,
    commit_hash_short,
    country,
    user,
    user_token
  }

  return HTTP(options)
    .then(json => json.data)
}

// Get basic root URL from static configuration
const douma_api_root = `${common_config.api.url}/${common_config.api.version}`
// const douma_api_root = `http://10.0.0.116:3000/${common_config.api.version}`

const try_reconnect = () => {
  standard_handler(common_config.api.url)
}

export {configure_standard_handler, standard_handler, douma_api_root, try_reconnect}



