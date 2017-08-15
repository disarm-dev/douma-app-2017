import {standard_handler, douma_api_root} from './remote.standard-handler.js'

// User authentiction
export const authenticate = (user) => {
  const url = douma_api_root + `/auth`

  const options = {
    data: {user},
    method: 'post',
    timeout: 10000
  }
  return standard_handler(url, options)
}
