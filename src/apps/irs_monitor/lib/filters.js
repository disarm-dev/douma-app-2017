import {get} from 'lodash'
import {Parser} from 'expr-eval'
export function filter_responses(responses, filters = []) {
  return responses.filter((response) => {
    return filter_response(response, filters)
  })
}


function filter_response(response, filters) {
  return filters.every(filter => {
    const {name, comparator, value} = filter

    let response_value = get(response, name, 0)

    // TODO: @refac Find another way to convert string to int
    if (name === 'recorded_on') {
      response_value = new Date(response_value).getTime()
    }

    const expr_string = `response_value ${comparator} ${value}`
    const variables = { response_value }
    
    return Parser.evaluate(expr_string, variables)
  })
}