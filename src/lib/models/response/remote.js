import {request_handler} from 'lib/remote/request-handler'

export default {read_all, create}

function read_all() {
  const request = _read_all()
  return request_handler(request)
}

function _read_all() {
  return {
    url_suffix: '/record/all',
  }
}


function create(responses) {
  const request = _create(responses)
  return request_handler(request)
}

function _create(responses) {
  if (!responses.length) return false

  return {
    url_suffix: '/record/create',
    timeout: 20000,
    method: 'post',
    data: responses
  }
}

