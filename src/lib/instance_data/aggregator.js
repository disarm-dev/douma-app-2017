import {Parser} from 'expr-eval'
import isNumber from 'is-number'

export function aggregate_on ({responses, denominators, aggregation}) {

  if (!aggregation) throw new Error(`Missing aggregation`)

  if (aggregation.hasOwnProperty('numerator_expr') && aggregation.hasOwnProperty('denominator_field')) {
    // Calculate proportion
    try {
      const numerator = _calculate_numerator(responses, aggregation.numerator_expr, aggregation.precondition)
      const denominator = _calculate_denominator(denominators, aggregation.denominator_field)
      const result = numerator / denominator

      if (!isNumber(result)) return 0

      return result
    } catch (e) {
      console.log(e)
      return 0
    }

  } else if (aggregation.hasOwnProperty('numerator_expr')) {
    // Calculate numerator only
    try {
      const numerator = _calculate_numerator(responses, aggregation.numerator_expr, aggregation.precondition)
      return numerator
    } catch (e) {
      console.log(e)
      return 0
    }

  } else if (aggregation.hasOwnProperty('denominator_field')) {
    // Calculate denominator only
    try {
      const denominator = _calculate_denominator(denominators, aggregation.denominator_field)
      return denominator
    } catch (e) {
      console.log(e)
      return 0
    }

  } else {
    return 0
  }
}

function _calculate_numerator(responses, numerator_expr, precondition) {
  const expression = new Parser.parse(numerator_expr)
  return responses.reduce((sum, {form_data}) => {

    const questions_answered = Object.keys(form_data)

    if (expression.variables().every(i => questions_answered.includes(i))) {

      const result = expression.evaluate(form_data)

      if (!isNumber(result)) return sum

      return sum + result
    } else {
      return sum
    }

  }, 0)
}

function _calculate_denominator(denominators, field) {
  if (!Array.isArray(denominators)) denominators = [denominators]

  return denominators.reduce((sum, denominator) => {
    const result = denominator[field]
    if (!isNumber(result)) return sum
    return sum + result
  }, 0)
}

