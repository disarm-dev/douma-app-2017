const instance_decorator = (responses, instance_config) => {
  return responses
  // insert magic here
  const decorators = instance_config.decorators

  // for decorator_key of decorators {
  //   const property_name = decorators[decorator_key]
  //   // more magic in here
  //   evaluate_decorator(responses, property_name, )
  // }

  // return decorated_responses
}

// const evaluate_decorator = (responses, property_name, decorator_expressions_array) => {
//   const key = property_name
//   const value = decorator_expressions_array

//   return {key: value}
// }


export default instance_decorator