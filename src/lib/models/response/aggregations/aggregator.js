import {Parser} from 'expr-eval'
import isNumber from 'is-number'
import {get, has} from 'lodash'
import {store} from 'apps/store'
import flow from 'lodash/fp/flow'
import compact from 'lodash/fp/compact'
import map from 'lodash/fp/map'
import uniq from 'lodash/fp/uniq'
import {get_denominator_enumerable_name} from 'lib/instance_data/spatial_hierarchy_helper'
import cache from 'config/cache'
import {get_planning_level_name} from "../../../instance_data/spatial_hierarchy_helper";

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
  const options = {operators: {'in': true}}
  const expression = new Parser(options).parse(numerator_expr)

  if (filter) {
    const result = categorical_aggregator(responses, expression)
    return result[filter] || 0
  } else {
    return numerical_aggregator(responses, expression)
  }
}

function calculate_denominator({responses, targets, options, aggregation}) {
  const spatial_filter = get(options, 'filters', []).filter(f => f.name.startsWith('location.selection'))[0]

  // If spatial_filter is active, then try to filter the targets to match
  if (spatial_filter) {
    const planning_level_name = get_planning_level_name()// e.g villages
    const location_selection_options = store.state.instance_config.location_selection[planning_level_name]

    if (!has(spatial_filter, 'name') || typeof spatial_filter.name === 'string') throw new Error("Filter missing a name")
    if (!has(spatial_filter, 'value')) throw new Error("Filter missing a value")
    const spatial_filter_name = spatial_filter.name.split('.')[2]// get the last last part of the spatial filter, ie category or id
    const spatial_filter_value = spatial_filter.value

    if (spatial_filter_name === 'id') {
      targets = targets.filter(t => t.id === spatial_filter_value)
    } else if(spatial_filter_name === 'category') {
      const ids = location_selection_options.filter(l => l.category === spatial_filter_value).map(l => l.id)
      targets = targets.filter(t => ids.includes(t.id))
    } else if (spatial_filter_name === 'name') {
      console.log('Not implemented: limiting of denominators for a spatial filter set on a name field')
    } else {
      throw new Error('Trying to handle a spatial filter which has neither id nor category')
    }
  }

  const enumerable_field = get_denominator_enumerable_name() // e.g. structures for NAM

  // For spatial bins (map and table and any spatial chart)
  const is_non_spatial_bin = !options.bin_by.startsWith('location.selection')
  // Should only have a single target

  // Else should use total_target - ie. from all targets
  const total_target = targets
    .filter(t => t[enumerable_field])
    .reduce((acc, t) => {
      return acc + t[enumerable_field]
    }, 0)

  // Non-Spatial bin
  if (is_non_spatial_bin) return total_target

//return spartial_total_target
  // Is a Spatial bin
  if (!['location.selection.id', 'location.selection.category'].includes(options.bin_by)) {
    throw new Error("Have a problem - options.bin_by should be spatial, but doesn't look to be")
  }

  const target_id = get(responses[0], options.bin_by)
  const found = targets.find(t => t.id === target_id)
  debugger
  if (found) {
    return found[enumerable_field]
  } else {
    return 0
  }

}
