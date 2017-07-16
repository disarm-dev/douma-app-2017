import get from 'lodash.get'
import flatten from 'lodash.flatten'
import uniq from 'lodash.uniq'

import {Parser} from 'expr-eval'

import {form_elements} from 'lib/instance_data/form_helpers'

function extract_aggregation_fields (aggregations) {
  const result_fields = []

  for(const aggregation in aggregations) {
    const numerator_expr = get(aggregations[aggregation], 'numerator_expr')
    const fields = numerator_expr ? new Parser.parse(numerator_expr).variables() : []
    result_fields.concat(fields)
  }

  return uniq(result_fields)
}

function extract_form_fields (form) {
  const elements = form_elements(form)
  return elements.map(e => e.name)
}

/**
 *
 * @param aggregations
 * @param form
 * @returns {boolean}
 */
const fields_for_aggregations_exist_in_form = ({aggregations, form}) => {
  const aggregation_fields = extract_aggregation_fields(aggregations)
  const form_fields = extract_form_fields(form)
  const result = aggregation_fields.every(val => form_fields.indexOf(val) >= 0)
  return result
}

export {fields_for_aggregations_exist_in_form}
