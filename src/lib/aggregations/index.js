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
      try {
        const numerator = this._calculate_numerator(responses, aggregation.numerator_function, aggregation.precondition)
        const denominator = this._calculate_denominator(denominators, aggregation.denominator_field)
        return numerator / denominator
      } catch (e) {
        console.log(e)
        return 0
      }

    } else if (aggregation.hasOwnProperty('numerator_function')) {
      // Calculate numerator only
      try {
        const numerator = this._calculate_numerator(responses, aggregation.numerator_function, aggregation.precondition)
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

  _calculate_numerator(responses, fn, precondition) {
    return responses.reduce((sum, {form_data}) => {
      if (precondition && !precondition(form_data)) return sum
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
