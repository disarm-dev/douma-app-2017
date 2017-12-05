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
    const spatial_aggregation_level = options.spatial_aggregation_level
    const planning_level_name = get_planning_level_name()// e.g villages

    if (!has(spatial_filter, 'name') || typeof spatial_filter.name !== 'string') throw new Error("Filter missing a name")
    if (!has(spatial_filter, 'value')) throw new Error("Filter missing a value")
    const spatial_filter_name = spatial_filter.name.split('.')[2]// get the last last part of the spatial filter, ie category or id
    const spatial_filter_value = spatial_filter.value

    // we have a matrix:
    // planning_level_name === spatial_aggregation_level OR NOT
    // filter_level === planning_level_name OR NOT


    const is_filtering_at_planning_level = spatial_filter_name === 'id'
    const is_aggrigating_at_planning_level = spatial_aggregation_level === planning_level_name



    if(is_filtering_at_planning_level && is_aggrigating_at_planning_level){
      // Filter targets to only include targets with the target id in the filter
      targets = targets.filter(t => t.id === spatial_filter_value)
    }

    if(is_filtering_at_planning_level && !is_aggrigating_at_planning_level){
      //Filter targets to only include targets for the districts the responses are in,
      let village_category = responses[0].location_selection.category
      targets = targets.filter(t => t.id === village_category)
    }

    if(!is_filtering_at_planning_level && is_aggrigating_at_planning_level){
      // Filter the targets to only include the targets under the category in the filter
      targets = targets.filter(t => t.category === spatial_filter_value)
    }

    if(!is_filtering_at_planning_level && !is_aggrigating_at_planning_level){
      // Filter the targets where target.id is equal to the category from the filter
      targets = targets.filter(t => t.id == spatial_filter_value)
    }
  }
  

  const enumerable_field = get_denominator_enumerable_name() // e.g. structures for NAM

  // Else should use total_target - ie. from all targets
  const total_target = targets
    .filter(t => t[enumerable_field])
    .reduce((acc, t) => {
      return acc + t[enumerable_field]
    }, 0)

   return total_target

}
