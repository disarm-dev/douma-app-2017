import {standard_handler, douma_api_root} from './remote.standard-handler.js'

// User authentiction
export const authenticate = (user) => {
  if (!DOUMA_PRODUCTION_MODE) {
    console.log("🚨 Hey, you're in development mode, you really want to auth with a remote service? If I had all the applets, I could fake a user right here for dev use.", user)
  }
    let url = douma_api_root + `/auth`

  let options = {
    data: {user},
    method: 'post',
    timeout: 10000
  }
  return standard_handler(url, options)
}
