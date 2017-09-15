import {get} from 'lodash'

export function filter_responses(responses, filters = []) {
  return responses.filter((response) => {
    return filter_response(response, filters)
  })
}


function filter_response(response, filters) {
  return filters.every(filter => {
    const {name, comparator, value} = filter
    // TODO: @feature use comparator
    return get(response, name, null) === value
  })
}