import bwa from './bwa.validations.js'
import nam from './nam.validations.js'
import swz from './swz.validations.js'
import zwe from './zwe.validations.js'

const check_rules = (form_rules) => {

  return (response) => {
    let failed_validations = []

    location_rules.forEach((rule) => {
      let rule_passed = rule.fn(response.location)
      if (!rule_passed) failed_validations.push(rule)
    })

    form_rules.forEach((rule) => {
      if (hasProperties(response.form_data, rule.relevant_questions)) {
        console.log('rule is ready', rule, response.form_data)
        let rule_passed = rule.fn(response.form_data)
        console.log('rule_passed', rule_passed)
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

export default {
  bwa: check_rules(bwa),
  nam: check_rules(nam),
  swz: check_rules(swz),
  zwe: check_rules(zwe)
}

function hasProperties(object = {}, properties) {


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
