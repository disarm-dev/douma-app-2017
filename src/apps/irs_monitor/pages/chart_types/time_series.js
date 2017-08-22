import moment_original from 'moment'
import {extendMoment} from 'moment-range'
const moment = extendMoment(moment_original)

import {nest} from 'd3-collection'
import {ascending} from 'd3-array'

import {aggregate_series_for_chart} from '../../lib/chart_bin_aggregations'


/**
 * Prepare data for time-series chart
 * @param responses {array}
 * @param denominators {array}
 * @param aggregations {array}
 * @param options.series
 * @param options.key_format moment format string
 * @param options.interval
 * @param options.chart_type
 * @param options.date_field
 * @returns {Array}
 */
export default function get_data({responses, denominators, aggregations, options}) {
  // from configuration/options
  const defaults = {
    // in addition need a series property passed in on options
    key_format: 'D MMM',
    interval: 'week',
    chart_type: 'bar',
    date_field: 'recorded_on',
  }

  options = {...defaults, ...options}

  // account for weeks starting on sunday
  const moment_interval = options.interval === 'week' ? 'isoWeek' : options.interval

  // split/bin into series
  const binned_responses = nest()
    .key(f => {
      const raw_date = f[options.date_field]
      return moment(raw_date).startOf(moment_interval).format()
    })
    .sortKeys(ascending)
    .entries(responses)


  // fill any gaps in timeseries
  const earliest = binned_responses[0].key
  const latest = binned_responses[binned_responses.length - 1].key
  const date_range = moment.range(earliest, latest)

  let filled_responses = []

  for (let step_date of date_range.by(options.interval)) {
    const week_commencing = moment(step_date).format()
    const step_date_formatted = moment(step_date).format(options.key_format)
    const bin_response = binned_responses.find(r => r.key === week_commencing)

    let values = []
    if (bin_response && bin_response.values.length !== 0) {
      values = bin_response.values
    }
    filled_responses.push({
      key: step_date_formatted,
      values
    })
  }

  return aggregate_series_for_chart({binned_responses: filled_responses, options, aggregations, denominators})

}

