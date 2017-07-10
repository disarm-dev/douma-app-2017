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

  options.url = url
  options.params = {...options.params, personalised_instance_id, commit_hash_short}
  return HTTP(options)
    .then(json => json.data)
}

// Get basic root URL from static configuration
const douma_api_root = `${common_config.api.url}/${common_config.api.version}`

export {configure_standard_handler, standard_handler, douma_api_root, }



