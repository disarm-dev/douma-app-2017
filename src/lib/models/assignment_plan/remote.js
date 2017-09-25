import {request_handler} from 'lib/remote/request-handler'

export default {get_assignment_plan, create_assignment_plan}

// PLANS
function get_assignment_plan() {
  const request = _get_assignment_plan()
  return request_handler(request)
}
function _get_assignment_plan() {
  return {
    url_suffix: '/assignment_plan/current',
    timeout: 10000
  }
}


function create_assignment_plan(assignment_plan) {
  const request = _create_assignment_plan(assignment_plan)
  return request_handler(request)
}

function _create_assignment_plan(assignment_plan) {
  return {
    url_suffix: '/assignment_plan/create',
    data: assignment_plan,
    method: 'post',
    timeout: 10000
  }
}

