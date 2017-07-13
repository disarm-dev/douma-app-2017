import {standard_handler, douma_api_root} from './remote.standard-handler.js'

// PLANS
export const get_assignment_plan = () => {
  let url = douma_api_root + `/assignment_plan/current`
  let options = {timeout: 10000}
  return standard_handler(url, options)
}

export const create_assignment_plan = (assignment_plan) => {
  let url = douma_api_root + `/assignment_plan/create`

  let options = {
    data: assignment_plan,
    method: 'post',
    timeout: 10000
  }

  return standard_handler(url, options)
}

