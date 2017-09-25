import CONFIG from 'config/common'
import {axios_instance} from 'lib/remote/axios_instance'

/**
 * Standard request handler for all remote requests (currently both client server and API)
 * Passed options overwrite any default options.
 * @param request
 */
export function request_handler(request) {

  if (!request) return Promise.reject(new Error("request is empty"))

  if (!request.url) {
    if (!request.url_suffix) throw new Error("Missing `url_suffix` on request")
    const douma_api_root = `${CONFIG.api.url}/${CONFIG.api.version}`
    request.url = douma_api_root + request.url_suffix
  }


  return axios_instance(request)
    .then(json => json.data)

}



