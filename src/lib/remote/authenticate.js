import {request_handler} from './request-handler.js'

export default {authenticate}

// User authentication
function authenticate(user) {
  const request = _authenticate(user)
  return request_handler(request)
}
function _authenticate(user) => {
  const url = douma_api_root + `/auth`

  const options = {
    data: {user},
    method: 'post',
    timeout: 10000
  }
  return request_handler(url, options)
}
