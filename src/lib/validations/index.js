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
      let rule_passed = rule.fn(response.form_data)
      if (!rule_passed) failed_validations.push(rule)
    })

    return failed_validations
  }
}

const location_rules = [
  {
    name: 'no_location',
    message: 'Location missing',
    fn: (location) => location,
    stopping_power: "hard",
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