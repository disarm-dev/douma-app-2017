import {nest} from 'd3-collection'
import {ascending} from 'd3-array'
import {get} from 'lodash'

import moment_original from 'moment'
import {extendMoment} from 'moment-range'
const moment = extendMoment(moment_original)


/**
 * C
 * @param responses
 * @param options
 */
export function categorical_bins({responses, options}) {
  // split/bin into series
  const binned_responses = nest()
    .key(f => get(f, options.bin_by))
    .sortKeys(ascending)
    .entries(responses)

  return binned_responses
}

/**
 * Create bins for a time series
 * @param responses
 * @param options
 * @returns {Array} - responses binned by time series (with gaps filled!)
 */
export function time_series_bins({responses, options}) {
  // from configuration/options
  const defaults = {
    // in addition need a series property passed in on options
    key_format: 'D MMM',
    interval: 'week',
  }

  options = {...defaults, ...options}

  // account for weeks starting on sunday
  const moment_interval = options.interval === 'week' ? 'isoWeek' : options.interval

  // split/bin into series
  const simple_binned_responses = nest()
    .key(f => {
      const raw_date = f[options.bin_by]
      return moment(raw_date).startOf(moment_interval).format()
    })
    .sortKeys(ascending)
    .entries(responses)


  // fill any gaps in timeseries
  const earliest = simple_binned_responses[0].key
  const latest = simple_binned_responses[simple_binned_responses.length - 1].key
  const date_range = moment.range(earliest, latest)

  let binned_responses = []

  for (let step_date of date_range.by(options.interval)) {
    const week_commencing = moment(step_date).format()
    const step_date_formatted = moment(step_date).format(options.key_format)
    const bin_response = simple_binned_responses.find(r => r.key === week_commencing)

    let values = []
    if (bin_response && bin_response.values.length !== 0) {
      values = bin_response.values
    }
    binned_responses.push({
      key: step_date_formatted,
      values
    })
  }

  return binned_responses
}
