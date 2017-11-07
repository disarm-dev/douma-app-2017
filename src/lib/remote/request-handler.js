import CONFIG from 'config/common'
import {config_axios_instance} from 'lib/remote/axios_instance'
import {get_api_url} from 'config/api_url'
import {store} from 'apps/store'

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
    if (!request.url_suffix && request.url_suffix !== '') throw new Error("Missing `url_suffix` on request")

    // Get API URL - either from localStorage or the default from CONFIG
    const api_url = get_api_url()

    const douma_api_root = `${api_url}/${CONFIG.api.version}`
    request.url = douma_api_root + request.url_suffix
  }

  const axios_instance = config_axios_instance()

  return axios_instance(request)
    .then(json => json.data)
    .catch(err => {
      // Any route other than login which receives 401 needs to tell user
      // Any other errors should be propogated
      if (request.url_suffix !== '/login' && err.response.status === 401) {
        store.commit('root:set_snackbar', {message: 'Current API key is not valid. Please log out and try to login again.'}, {root: true})
        throw err
      } else {
        throw err
      }
    })
}



