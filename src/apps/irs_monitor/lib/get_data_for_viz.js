import {aggregate_for_chart, aggregate_for_map, aggregate_for_pie, aggregate_for_table} from './aggregate_data_for_viz'
import {categorical_bins, time_series_bins} from './bin_responses'

/**
 * Prepare and aggregate data for a basic series chart
 * @param {array} responses - bunch of responses
 * @param {array} targets - from a Plan
 * @param {array} aggregations - extracted from `instance_config`
 * @param {object} options - options
 * @param {string} options.chart_type - "bar", "line"
 * @param {string} [options.bin_by] - property to bin by
 * @param {string} [options.series_by] - property to create series from
 * @param {boolean} [options.cumulative] - used with time_series only, whether or not to create cumulative values
 * @returns {array}
 */
export default function get_data({responses, targets, aggregations, options}) {

  // check got enough options to start
  if (!options.chart_type) throw new Error("Missing `options.chart_type`")

  // Create categorical or time_series bins of responses
  let binned_responses
  if (options.time_series) {
    binned_responses = time_series_bins({responses, options})
  } else {
    binned_responses = categorical_bins({responses, options})
  }

  let data
  switch (options.chart_type) {
    case 'pie':
      data = aggregate_for_pie({binned_responses, options, aggregations, targets})
      break
    case 'bar':
      data = aggregate_for_chart({binned_responses, options, aggregations, targets})
      break
    case 'line':
      data = aggregate_for_chart({binned_responses, options, aggregations, targets})
      break
    case 'table':
      data = aggregate_for_table({binned_responses, options, aggregations, targets})
      break
    case 'map':
      data = aggregate_for_map({binned_responses, options, aggregations, targets})
      break
    default:
      console.error(`Didn't find an aggregation method for ${options.chart_type}.`)
  }

  return data
}

