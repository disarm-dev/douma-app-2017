import {standard_handler, douma_api_root} from './remote.standard-handler.js'

// PLANS
export const get_current_plan = (country) => {
  let url = douma_api_root + `/plan/current?country=${country}`
  let options = {timeout: 10000}
  return standard_handler(url, options)
}

export const create_plan = (plan) => {
  let url = douma_api_root + `/plan/create`

  let options = {
    data: plan,
    method: 'post',
    timeout: 10000
  }

  return standard_handler(url, options)
}

