import CONFIG from 'config/common'
import {config_axios_instance} from 'lib/remote/axios_instance'
import {get_api_url} from 'config/api_url'

/**
 * Standard request handler for all remote requests (currently both client server and API)
 * Passed options overwrite any default options.
 * @param request
 */
export function request_handler(request) {

  if (!request) return Promise.reject(new Error("request is empty"))

  // If a `request.url` is not already provided, will create one
  // to send request to API server
  if (!request.url) {
    if (!request.url_suffix) throw new Error("Missing `url_suffix` on request")

    // Get API URL
    const api_url = get_api_url()
    console.log('api_url', api_url)

    const douma_api_root = `${api_url}/${CONFIG.api.version}`
    request.url = douma_api_root + request.url_suffix
  }

  const axios_instance = config_axios_instance()

  return axios_instance(request)
    .then(json => json.data)

}



