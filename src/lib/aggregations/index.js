import bwa from './bwa.aggregations.js'
import nam from './nam.aggregations.js'
import swz from './swz.aggregations.js'
import zwe from './zwe.aggregations.js'

// const aggregations = {bwa, nam, swz, zwe}
const aggregations = {swz}

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
      const numerator = this._calculate_numerator(responses, aggregation.numerator_function)
      const denominator = this._calculate_denominator(denominators, aggregation.denominator_field)
      return numerator / denominator

    } else if (aggregation.hasOwnProperty('numerator_function')) {
      // Calculate numerator only
      const numerator = this._calculate_numerator(responses, aggregation.numerator_function)
      return numerator

    } else if (aggregation.hasOwnProperty('denominator_field')) {
      // Calculate denominator only
      const denominator = this._calculate_denominator(denominators, aggregation.denominator_field)
      return denominator

    }

  }

  _calculate_numerator(responses, fn) {
    return responses.reduce((sum, {form_data}) => {
      return sum + fn(form_data)
    }, 0)
  }

  _calculate_denominator(denominators, field) {
    if (!Array.isArray(denominators)) denominators = [denominators]

    return denominators.reduce((sum, denominator) =>  {
      return sum + denominator[field]
    }, 0)
  }

}
