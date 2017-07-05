import {standard_handler, douma_api_root} from './standard-handler.js'

// User authentiction
export const authenticate = (user) => {
  let url = douma_api_root + `/auth`

  let options = {
    data: {user},
    method: 'post',
    timeout: 10000
  }
  return standard_handler(url, options)
}
