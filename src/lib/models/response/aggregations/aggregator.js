import {Parser} from 'expr-eval'
import isNumber from 'is-number'
import {get} from 'lodash'
import flow from 'lodash/fp/flow'
import compact from 'lodash/fp/compact'
import map from 'lodash/fp/map'
import uniq from 'lodash/fp/uniq'
import {get_denominator_enumerable_name} from 'lib/instance_data/spatial_hierarchy_helper'
import cache from 'config/cache'

/**
 * For the given array of responses, will reduce to a single value
 * @param {array} responses
 * @param targets
 * @param aggregation {Aggregation Object}
 * @returns {number}
 */
export function aggregate_on({responses, targets, aggregation, previous_aggregations, options}) {
  let numerator, denominator, result // because webpack

  // TODO: @refac Taking an array of aggregations might require fewer iterations of each response --> faster?
  if (!aggregation) throw new Error(`Missing aggregation`)

  if (aggregation.hasOwnProperty('numerator_expr') && aggregation.hasOwnProperty('denominator_field')) {
    // Calculate proportion
    try {
      numerator = calculate_numerator({responses, ...aggregation})
      denominator = calculate_denominator({responses, targets, options, aggregation})
      result = numerator / denominator

      if (!isNumber(result)) return 0
      return result * 100
    } catch (e) {
      console.log(e)
      return 0
    }

  } else if (aggregation.hasOwnProperty('numerator_expr') && aggregation.hasOwnProperty('denominator_aggregation')) {
    // Calculate proportion
    try {
      numerator = calculate_numerator({responses, ...aggregation})
      if (!previous_aggregations.hasOwnProperty(aggregation.denominator_aggregation)) console.log(`Don't have dependent aggregation of "${aggregation.denominator_aggregation}" for "${aggregation.name}"`)

      denominator = previous_aggregations[aggregation.denominator_aggregation]

      result = numerator / denominator

      if (!isNumber(result)) {
        return 0
      }

      return result * 100
    } catch (e) {
      console.log(e)
      return 0
    }

  } else if (aggregation.hasOwnProperty('numerator_expr')) {
    // Calculate numerator only
    try {
      numerator = calculate_numerator({responses, ...aggregation, options})
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

function calculate_numerator({responses, numerator_expr, filter}) {
  const options = { operators: { 'in': true } }
  const expression = new Parser(options).parse(numerator_expr)

  if (filter) {
    const result = categorical_aggregator(responses, expression)
    return result[filter] || 0
  } else {
    return numerical_aggregator(responses, expression)
  }
}

function calculate_denominator({responses, targets, options, aggregation}) {
  const enumerable_field = get_denominator_enumerable_name() // e.g. structures for NAM

  // location.selection.id or location.selection.category
  const location_grouping_field = get(options, "geographic_level_refactor_this_key_name", false) || get(options, 'bin_by', 'location.selection.id')

  // get all area ids
  const unique_area_ids_from_responses = flow(
    map(location_grouping_field),
    uniq
  )(responses)

  // should be passing spatial_aggregation_level, but we're not, so need to guess
  const spatial_aggregation_level_geodata_field = location_grouping_field === 'location.selection.id' ? '__disarm_geo_id' : '__disarm_geo_name'

  // create array of feature properties for geodata which relates to responses
  const geodata_features = cache.geodata[options.spatial_aggregation_level].features
  const unique_targets = flow(
    map(area_id => {
      const target = geodata_features.find(f => f.properties[spatial_aggregation_level_geodata_field] === area_id)
      return target.properties
    }),
    compact
  )(unique_area_ids_from_responses)

  // add the enumeral from the targets together to get denominator
  const denominator = unique_targets.reduce((acc, target) => {
    return acc + target[aggregation.denominator_field]
  }, 0)

  return denominator
}

