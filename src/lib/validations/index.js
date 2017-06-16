import bwa from './bwa.validations.json'
import nam from './nam.validations.json'
import swz from './swz.validations.json'
import zwe from './zwe.validations.json'

import {elements_array} from 'lib/form_helpers'

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
    this.slug = instance_config.slug
  }

  validate({location, survey}) {
    console.log('validating', location, survey)

    // const location_results = this._validate_location(location)
    // const survey_results = this._validate_survey(survey)

    return {
      errors: [],
      warnings: []
    }
  }

  _validate_location(location) {
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

}
