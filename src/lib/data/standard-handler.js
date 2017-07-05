import axios from 'axios'

import common_config from 'config/common_config'

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

// Get basic root URL from static configuration
const douma_api_root = `${common_config.api.url}/${common_config.api.version}`

export {standard_handler, douma_api_root}



