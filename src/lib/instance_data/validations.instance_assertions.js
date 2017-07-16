import get from 'lodash.get'
import flatten from 'lodash.flatten'
import uniq from 'lodash.uniq'

import {Parser} from 'expr-eval'

import {form_elements} from 'lib/instance_data/form_helpers'

function extract_validation_fields (validations) {
  const result_fields = []

  for(const validation in validations) {
    const precondition = get(validations[validation], 'precondition')
    const precondition_fields = precondition ? new Parser.parse(precondition).variables() : []

    const expression = get(validations[validation], 'expression')
    const expression_fields = expression ? new Parser.parse(expression).variables() : []
    result_fields.concat(precondition_fields, expression_fields)
  }

  return uniq(result_fields)
}

function extract_form_fields (form) {
  const elements = form_elements(form)
  return elements.map(e => e.name)
}

/**
 *
 * @param validations
 * @param form
 * @returns {boolean}
 */
const fields_for_validations_exist_in_form = ({validations, form}) => {
  const validation_fields = extract_validation_fields(validations)
  const form_fields = extract_form_fields(form)
  return validation_fields.every(val => form_fields.indexOf(val) >= 0)
}

export {fields_for_validations_exist_in_form}
