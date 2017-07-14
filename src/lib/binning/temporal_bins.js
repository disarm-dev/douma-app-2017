const moment = require('moment')

const MOMENT_INTERVALS = ['months', 'weeks']

const test_responses = [
  {
    recorded_on: '2017-01-01'
  },
  {
    recorded_on: '2017-01-21'
  },
  {
    recorded_on: '2017-04-02'
  },
  {
    recorded_on: '2017-02-15'
  },
  {
    recorded_on: '2017-03-15'
  },
  {
    recorded_on: '2017-11-11'
  }
]


function bin_names_from_dates({responses, interval = 'months'}) {
  if (!MOMENT_INTERVALS.includes(interval)) throw new Error(`Invalid interval passed: ${interval}`)

  const dates_ms = responses.map(response => {
    if (!response.recorded_on) return null
    return moment(response.recorded_on).valueOf()
  }).filter(i => i).sort()

  const start_date_ms = dates_ms[0] // epoch
  const end_date_ms = dates_ms[dates_ms.length - 1] // epoch

  // Get unique bins
  let now_date_ms = start_date_ms
  let bin_names = []

  while (now_date_ms <= end_date_ms) {
    const bin_date = get_first_of({date: now_date_ms, interval})
    const formatted_date = bin_date.format('YYYY-MM-DD')
    bin_names.push(formatted_date)

    now_date_ms = moment(now_date_ms).add(1, interval).valueOf()
  }

  return bin_names
}

const get_temporally_binned_responses = ({responses, temporal_filter_definition}) => {
  // find start and end dates, and use 'month' as default interval
  console.log(bin_names_from_dates({responses,interval: 'months'}))


    //
    //
    // // create set of bins
    // const bins = []
    // // iterate all responses, and put into correct bins
    // const eg_bins = [
    //   {
    //     time_slice: 1,
    //     human_readable_time_slice: '1st August to 7th August',
    //     responses: [
    //       {
    //         id: 1,
    //         ...fields
    //       }
    //     ]
    //   },
    //   {
    //     time_slice: 2,
    //     human_readable_time_slice: '8th August to 14th August',
    //     responses: [
    //       {
    //         id: 1,
    //         ...fields
    //       }
    //     ]
    //   }]


  // }
}

const get_temporally_binned_aggregations = ({responses, temporal_filter_definition}) => {
  const bins = get_temporally_binned_responses({responses, temporal_filter_definition})


  bins.forEach(bin => {
    const all_aggregations = INSTANCE_AGGREGATIONS
    const denominator_for_bin = get_denominator_for_bin(bin)
    const binned_aggregations = all_aggregations.map(aggregation => {
      return aggregation(bin.responses, denominator_for_bin)
    })
    return binned_aggregations
  })
}

const get_first_of = ({date, interval}) => {
  if (interval === 'weeks') {
    return moment(date).day(1)
  } else {
    return moment(date).date(1)
  }
}

// export {get_temporally_binned_aggregations}

get_temporally_binned_responses({responses: test_responses})
