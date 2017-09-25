import {request_handler} from './request-handler'

export function try_reconnect() {
  return request_handler(CONFIG.api.url)
}

export function get_version() {
  const options = {
    timeout: 2000
  }
  return request_handler('/VERSION', options)
}

