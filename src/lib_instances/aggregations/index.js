import {Parser} from 'expr-eval'
import isNumber from 'is-number'

import bwa from './bwa.aggregations.js'
import nam from './nam.aggregations.js'
import swz from './swz.aggregations.js'
import zwe from './zwe.aggregations.js'

const aggregations = {bwa, nam, swz, zwe}

export class Aggregator {
  constructor(slug) {
    this.slug = slug
    this.aggregations = aggregations[slug]
  }

  calculate({responses, denominators, aggregation_name}) {
    const aggregation = this.aggregations[aggregation_name]

    if (!aggregation) {
      throw new Error(`Missing aggregation ${aggregation_name} for ${this.slug}`)
    }

    if (aggregation.hasOwnProperty('numerator_function') && aggregation.hasOwnProperty('denominator_field')) {
      // Calculate proportion
      try {
        const numerator = this._calculate_numerator(responses, aggregation.numerator_expr, aggregation.precondition)
        const denominator = this._calculate_denominator(denominators, aggregation.denominator_field)
        const result = numerator / denominator

        if (!isNumber(result)) return 0

        return result
      } catch (e) {
        console.log(e)
        return 0
      }

    } else if (aggregation.hasOwnProperty('numerator_function')) {
      // Calculate numerator only
      try {
        const numerator = this._calculate_numerator(responses, aggregation.numerator_expr, aggregation.precondition)
        return numerator
      } catch (e) {
        console.log(e)
        return 0
      }

    } else if (aggregation.hasOwnProperty('denominator_field')) {
      // Calculate denominator only
      try {
        const denominator = this._calculate_denominator(denominators, aggregation.denominator_field)
        return denominator
      } catch (e) {
        console.log(e)
        return 0
      }

    }

  }

  _calculate_numerator(responses, numerator_expr, precondition) {
    const expression = new Parser.parse(numerator_expr)
    return responses.reduce((sum, {form_data}) => {

      const questions_answered = Object.keys(this.form_data)

      if (expression.variables().every(i => questions_answered.includes(i))) {
        let parsed_for_numbers = []
        questions_answered.forEach(i => {
          const value = this.test_values[i]
          const parsed = parseFloat(value)
          if (Number.isNaN(parsed)) {
            parsed_for_numbers[i] = value
          } else {
            parsed_for_numbers[i] = parsed
          }
        })
        const result = expression.evaluate(form_data)
        if (!isNumber(result)) return sum
        return sum + result
      } else {
        return sum
      }

    }, 0)
  }

  _calculate_denominator(denominators, field) {
    if (!Array.isArray(denominators)) denominators = [denominators]

    return denominators.reduce((sum, denominator) =>  {
      const result = denominator[field]
      if (!isNumber(result)) return sum
      return sum + result
    }, 0)
  }

}
