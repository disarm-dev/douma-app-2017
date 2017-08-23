import {nest} from 'd3-collection'
import {ascending} from 'd3-array'
import get from 'lodash.get'
import {aggregate_series_for_chart} from './aggregate_data_for_chart'

/**
 * Prepare and aggregate data for a basic series chart
 * @param responses
 * @param targets
 * @param aggregations
 * @param options {object}
 * @param options.chart_type {string}
 * @param [options.bin_by] {string} - property to bin by
 * @param [options.series_by] {string} - property to create series from
 * @param [options.cumulative] {boolean} - used with time_series only, whether or not to create cumulative values
 * @returns {array}
 */
export default function get_data({responses, targets, aggregations, options}) {

  // check got options
  if (!options.chart_type) throw new Error("Missing `options.chart_type`")


  // split/bin into series
  const binned_responses = nest()
    .key(f => get(f, options.bin_by))
    .sortKeys(ascending)
    .entries(responses)

  switch (options.chart_type) {
    case 'pie':
      return aggregate_series_for_chart({binned_responses, options, aggregations, targets})
    case 'bar':
      return
    default:
      console.error(`Didn't find an aggregation method for ${options.chart_type}.`)
  }

}

