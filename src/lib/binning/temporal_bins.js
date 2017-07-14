const moment = require('moment')
const get = require('lodash.get')

const MOMENT_INTERVALS = ['months', 'weeks']

const test_responses = [
  {
    recorded_on: '2017-01-01',
    value: 1
  },
  {
    recorded_on: '2017-01-21',
    value: 1
  },
  {
    recorded_on: '2017-04-02',
    value: 1
  },
  {
    recorded_on: '2017-02-15',
    value: 1
  },
  {
    recorded_on: '2017-03-15',
    value: 1
  },
  // {
  //   recorded_on: '2017-11-11',
  //   value: 1
  // }
]


const get_dates_ms_from_responses = (responses) => {
  const dates_ms = responses.map(response => {
    if (!response.recorded_on) return null
    return moment(response.recorded_on).valueOf()
  }).filter(i => i).sort()

  const start_date_ms = dates_ms[0] // epoch
  const end_date_ms = dates_ms[dates_ms.length - 1] // epoch

  return {start_date_ms, end_date_ms}
}

const bin_names_from_dates = ({responses, interval}) => {
  if (!MOMENT_INTERVALS.includes(interval)) throw new Error(`Invalid interval passed: ${interval}`)

  const {start_date_ms, end_date_ms}= get_dates_ms_from_responses(responses)

  // Get unique bins
  let now_date_ms = start_date_ms
  let bin_names = []

  while (now_date_ms <= end_date_ms) {
    const bin_date = get_first_day_of({date: now_date_ms, interval})
    const formatted_date = format_as_bin_date(bin_date)
    bin_names.push(formatted_date)

    const next_now = moment(bin_date).add(1, interval)
    now_date_ms = next_now.valueOf()
  }

  return bin_names
}

const get_temporally_binned_responses = ({responses, interval}) => {
  const bin_names = bin_names_from_dates({responses, interval})
  let bins = bin_names.map(name => ({time_slice: name, responses: []}))

  responses.forEach(response => {
    const right_bin = find_bin_for({response, bins, interval})

    right_bin.responses.push(response)
  })

  return bins
}

function responses_within_temporal_filter({responses, temporal_filter_definition}) {

  // No start_date and no end_date, just return responses
  if (!temporal_filter_definition.start_date && !temporal_filter_definition.end_date) return responses

  let {start_date_ms, end_date_ms} = get_dates_ms_from_responses(responses)

  start_date_ms = temporal_filter_definition.start_date || start_date_ms
  end_date_ms = temporal_filter_definition.end_date || end_date_ms

  // start_date, but no end_date --> filter
  // end_date but no start_date --> filter
  // both start_date and end_date --> filter
  return responses_within_date_filters = responses.filter(response => {
    const response_date = moment(response.recorded_on).valueOf()
    return (response_date >= moment(start_date_ms).valueOf()) && (response_date <= moment(end_date_ms).valueOf())
  })
}

/**
 * Get temporal bins with aggregations
 * @param responses
 * @param temporal_filter_definition
 * @returns {*}
 */
const get_temporally_binned_aggregations = ({responses, temporal_filter_definition = {}}) => {
  // Find relevant responses (i.e. within temporal filter range)
  const responses_within_date_filters = responses_within_temporal_filter({responses, temporal_filter_definition})

  // Get bins
  const interval = get(temporal_filter_definition, 'interval', 'months')
  const bins = get_temporally_binned_responses({responses: responses_within_date_filters, interval})

  if (temporal_filter_definition.raw_responses) return console.log(bins)
  // return console.log(bins)
  // Work through responses in each bin, doing the aggregation
  bins.forEach(bin => {
    bin.sum_of_values = bin.responses.reduce((acc, response) => {
      return acc + response.value
    }, 0)

    delete bin.responses

    // const all_aggregations = INSTANCE_AGGREGATIONS
    // const denominator_for_bin = get_denominator_for_bin(bin)
    // const binned_aggregations = all_aggregations.map(aggregation => {
    //   return aggregation(bin.responses, denominator_for_bin)
    // })
    // return binned_aggregations
  })

  console.log(bins)
}

// Helpers, utilities

const get_first_day_of = ({date, interval}) => {
  if (interval === 'weeks') {
    return moment(date).startOf('isoweek')
  } else {
    return moment(date).startOf('month')
  }
}

const format_as_bin_date = (moment_date) => {
  return moment_date.format('YYYY-MM-DD')
}

const find_bin_for = ({response, bins, interval}) => {
  const first_day_of_period_for_response_date = get_first_day_of({date: response.recorded_on, interval})
  const response_date_as_time_slice = format_as_bin_date(first_day_of_period_for_response_date)
  return bins.find(bin => bin.time_slice === response_date_as_time_slice)
}

export {get_temporally_binned_aggregations}

//
//
// // DEBUG
// get_temporally_binned_aggregations({
//   responses: test_responses,
//   temporal_filter_definition: {
//     interval: 'months',
//     // raw_responses: true,
//     // start_date: '2017-01-01',
//     // start_date: '2017-03-01',
//     // end_date: '2017-04-02'
//     // end_date: '2017-02-02'
//     // end_date: '2017-02-15'
//   }
// })

