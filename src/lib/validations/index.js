import {Parser} from 'expr-eval'

import bwa from './bwa.validations.json'
import nam from './nam.validations.json'
import swz from './swz.validations.json'
import zwe from './zwe.validations.json'

const all_validations = {bwa, nam, swz, zwe}


const check_rules = (form_rules) => {

  return (response, form) => {

    let failed_validations = []

    form_rules.forEach((rule) => {
      if (hasAllRequiredAnswers(response.form_data, rule.relevant_questions)) {
        let rule_passed = rule.fn(response.form_data)
        if (!rule_passed) failed_validations.push(rule)
      }
    })
    let validation_result = {
      errors: failed_validations.filter(v => v.type === 'error'),
      warnings: failed_validations.filter(v => v.type === 'warning')
    }
    return validation_result
  }
}


function hasAllRequiredAnswers(object = {}, properties) {
  for (var i = properties.length - 1; i >= 0; i--) {
    let property = properties[i]
    if (object.hasOwnProperty(property) && object[property] !== undefined) {
      continue
    } else {
      return false
    }
  }
  return true
}


export class Validator {
  constructor(instance_config) {
    const slug = instance_config.slug
    if(!slug) throw new Error("Cannot find slug on", instance_config)
    this.validations = all_validations[slug]
    return this
  }

  validate(response) {
    let results = []

    const location_results = this._validate_location(response.location)
    const location_selection_results = this._validate_location_selection(response.location_selection)
    results = results.concat(location_results, location_selection_results)

    const survey_results = this._validate_form_data(response.form_data)
    results = results.concat(survey_results)

    const errors = results.filter(r => r.type === 'error')
    const warnings = results.filter(r => r.type === 'warning')

    return {errors, warnings}
  }

  _validate_form_data(form_data) {
    if (!Object.keys(form_data).length) return []

    const survey_variables = Object.keys(form_data)

    const survey_validations = this.validations.map(validation=> {

      if (validation.precondition) {
        let precondition_passed = false
        const precondition_expr = new Parser.parse(validation.precondition)
        const precondition_vars = precondition_expr.variables()
        const precondition_vars_exist = precondition_vars.every(i => survey_variables.includes(i))
        if (precondition_vars_exist && precondition_expr.evaluate(form_data)) {
          precondition_passed = true
        }

        // console.log('precondition_passed', precondition_passed)
        if (!precondition_passed) {
          return {...validation, status: 'precondition_failed'}
        }
      } else {
        // console.log('no precondition to evaluate')
      }

      const expression_expr = new Parser.parse(validation.expression)
      const expression_vars = expression_expr.variables()
      const expression_vars_exist = expression_vars.every(i => survey_variables.includes(i))

      // Not enough variables to run the test
      if (!expression_vars_exist) {
        return {
          ...validation,
          questions: expression_vars,
          status: 'not_ready'
        }
      }

      const expression_eval_result = expression_expr.evaluate(form_data)

      if (expression_eval_result) {
        // Can run expression, and it passes
        return {...validation, questions: expression_vars, status: 'passed'}
      } else {
        // Can run expression, and it fails
        return {...validation, questions: expression_vars, status: 'failed'}
      }
    })

    const failing_survey_validations = survey_validations.filter(v => v.status === 'failed')
    return failing_survey_validations
  }

  _validate_location(location) {
    return []
    const location_rules = [
      {
        name: 'no_location',
        message: 'Location missing',
        fn: (location) => {
          return location && location.hasOwnProperty('coords') && location.coords.hasOwnProperty('accuracy')
        },
        type: "error",
        input_questions: [],
        output_question: ''
      }
    ]

    location_rules.forEach((rule) => {
      let rule_passed = rule.fn(location)
      if (!rule_passed) failed_validations.push(rule)
    })

  }

  _validate_location_selection(location_selection) {
    return []
  }
}
