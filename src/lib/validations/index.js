import bwa from './bwa.validations.js'
import nam from './nam.validations.js'
import swz from './swz.validations.js'
import zwe from './zwe.validations.js'

import {elements_array} from '@/lib/form_helpers';

const check_rules = (rules) => {

  return (form_data) => {

    let errors = rules.filter((rule) => {
      let rule_passed = rule.fn(form_data)
      if (rule_passed) {
        // console.log('rule passed', rule.name)
        return false
      } else {
        return true
      }
    })
    return errors.map((rule) => rule.error_message)
  }
}

export default {
  bwa: check_rules(bwa), 
  nam: check_rules(nam), 
  swz: check_rules(swz), 
  zwe: check_rules(zwe)
}