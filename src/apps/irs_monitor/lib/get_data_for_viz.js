import {decorate_for_chart, decorate_for_map, decorate_for_pie, decorate_for_table} from './decorate_data_for_viz'
import {categorical_bins, spatial_bins, time_series_bins} from './bin_responses'

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
export default function get_data({responses, targets, aggregations, options, geodata}) {

  // check got enough options to start
  if (!options.chart_type) throw new Error("Missing `options.chart_type`")

  // Create categorical or time_series bins of responses
  const binned_responses = bin_responses(responses, options)


  // The 'decorate' functions below also include the aggregation process

  // Create data in right structure depending on chart_type and options (esp. in 'aggregate_for_chart')
  let data
  switch (options.chart_type) {
    case 'pie':
      data = decorate_for_pie({binned_responses, targets, aggregations, options})
      break
    case 'bar':
      data = decorate_for_chart({binned_responses, targets, aggregations, options})
      break
    case 'line':
      data = decorate_for_chart({binned_responses, targets, aggregations, options})
      break
    case 'table':
      data = decorate_for_table({binned_responses, targets, aggregations, options})
      break
    case 'map':
      data = decorate_for_map({binned_responses, targets, aggregations, options})
      break
    default:
      console.error(`Didn't find an aggregation method for ${options.chart_type}.`)
  }

  return data
}

function bin_responses(responses, options) {
  let binned_responses
  if (options.time_series) {
    binned_responses = time_series_bins({responses, options})
  } else if (options.spatial_bins) {
    binned_responses = spatial_bins({responses, options})
  } else {
    binned_responses = categorical_bins({responses, options})
  }
  return binned_responses
}
