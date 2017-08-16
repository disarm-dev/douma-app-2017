import {Parser} from 'expr-eval'

const instance_decorator = (responses, instance_config) => {
  const decorators = instance_config.decorators

  const decorated_responses = responses.map((response) => {
    return evaluate_decorators(response, decorators)
  })

  return decorated_responses
}

const evaluate_decorators = (response, decorators) => {
  const computed_value_names = Object.keys(decorators)

  // Loop over the decorators
  const computed_values = computed_value_names.reduce((result, computed_value_name) => {
    const decorator_expressions_array = decorators[computed_value_name]

    result[computed_value_name] = evaluate_decorator(response, decorator_expressions_array)

    return result
  }, {})


  // Attach the computed values to the response and return it
  response.computed = computed_values
  return response
}

const evaluate_decorator = (response, decorator_expressions_array) => {

  // expression is something like {"red": "any_sprayed === true"},
  for (const expression_definition of decorator_expressions_array) {
    // possible_value_name is 'red'
    const possible_value_name = Object.keys(expression_definition)[0]

    // expression is "any_sprayed === true"
    const expression = expression_definition[possible_value_name]

    const parser = new Parser(expression)
    
    const parsed_expresssion = parser.parse(expression)

    if (form_data_has_required_variables(response, parsed_expresssion.variables())) {
      const evaluation_result = parsed_expresssion.evaluate(response.form_data)
    
      // evaluation_result is a boolean
      if (evaluation_result) {
        return possible_value_name
      }
    }
  }
  // return undefined as a default
  return undefined
}

const form_data_has_required_variables = (response, required_variables) => {
  const response_variables = Object.keys(response.form_data)

  for (const required of required_variables) {
    if (!response_variables.includes(required)) {
      return false
    }
  }
  
  return true
}


export default instance_decorator