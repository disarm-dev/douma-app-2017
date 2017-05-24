import bwa from './bwa.validations.js'
import nam from './nam.validations.js'
import swz from './swz.validations.js'
import zwe from './zwe.validations.js'

const check_rules = (rules) => {

  return (form_data) => {

    return rules.filter((rule) => {
      let rule_passed = rule.fn(form_data)
      if (rule_passed) {
        return false
      } else {
        return true
      }
    })
  }
}

export default {
  bwa: check_rules(bwa), 
  nam: check_rules(nam), 
  swz: check_rules(swz), 
  zwe: check_rules(zwe)
}