import {request_handler, douma_api_root} from '../../remote/request-handler.js'

// PLANS
export const get_current_plan = () => {
  let url = douma_api_root + `/plan/current`
  let options = {timeout: 10000}
  return request_handler(url, options)
}

export const create_plan = (plan) => {
  let url = douma_api_root + `/plan/create`

  let options = {
    data: plan,
    method: 'post',
    timeout: 10000
  }

  return request_handler(url, options)
}

