import {Parser} from 'expr-eval'
import isNumber from 'is-number'
import flow from 'lodash/fp/flow'
import compact from 'lodash/fp/compact'
import map from 'lodash/fp/map'
import uniq from 'lodash/fp/uniq'
import {get_denominator_enumerable_name} from 'lib/instance_data/spatial_hierarchy_helper'

/**
 * For the given array of responses, will reduce to a single value
 * @param {array} responses
 * @param targets
 * @param aggregation {Aggregation Object}
 * @returns {number}
 */
export function aggregate_on({responses, targets, aggregation}) {
  // TODO: @refac Taking an array of aggregations might require fewer iterations of each response --> faster?
  if (!aggregation) throw new Error(`Missing aggregation`)

  if (aggregation.hasOwnProperty('numerator_expr') && aggregation.hasOwnProperty('denominator_field')) {
    // Calculate proportion
    try {
      const numerator = _calculate_numerator({responses, ...aggregation})
      const denominator = _calculate_denominator({responses, targets})
      const result = numerator / denominator

      if (!isNumber(result)) return 0

      return result * 100
    } catch (e) {
      console.log(e)
      return 0
    }

  } else if (aggregation.hasOwnProperty('numerator_expr')) {
    // Calculate numerator only
    try {
      const numerator = _calculate_numerator({responses, ...aggregation})
      return numerator
    } catch (e) {
      console.log(e)
      return 0
    }
  }
}


function numerical_aggregator(responses, expression) {
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


export function categorical_aggregator(responses, expression) {
  return responses.reduce((accumulator, {form_data}) => {

    const questions_answered = Object.keys(form_data)

    if (expression.variables().every(i => questions_answered.includes(i))) {
      // this will return the 'full' value (i.e. an array or object)
      const answer_array = expression.evaluate(form_data)

      for (const answer of answer_array) {
        if (accumulator.hasOwnProperty(answer)) {
          accumulator[answer] += 1
        } else {
          accumulator[answer] = 1
        }
      }
    }

    return accumulator
  }, {})
}

function _calculate_numerator({responses, numerator_expr, filter}) {
  const expression = new Parser.parse(numerator_expr)

  if (filter) {
    const result = categorical_aggregator(responses, expression)
    return result[filter] || 0
  } else {
    return numerical_aggregator(responses, expression)
  }
}

function _calculate_denominator({responses, targets}) {

  const enumerable_field = get_denominator_enumerable_name()

  // get all area ids
  const unique_area_ids_from_responses = flow(
    map('location.selection.id'),
    uniq
  )(responses)

  // get target for each unique_area_id
  const unique_targets = flow(
    map((area_id) => {
      const target = targets.find(d => d.id === area_id)
      return target
    }),
    compact
  )(unique_area_ids_from_responses)

  // add the enumeral from the targets together to get denominator
  const denominator = unique_targets.reduce((acc, target) => {
    return acc + target[enumerable_field]
  }, 0)

  return denominator
}

