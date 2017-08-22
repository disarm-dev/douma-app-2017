import moment_original from 'moment'
import {extendMoment} from 'moment-range'
const moment = extendMoment(moment_original)

import {nest} from 'd3-collection'
import {ascending} from 'd3-array'

import {aggregate_on} from 'lib/instance_data/aggregator'

const demo_options = {
  series: [
    {
      name: 'structures sprayed',
      colour: 'green'
    },
    {
      name: 'sprayable structures not sprayed',
      colour: 'red'
    }
  ]
}

export default {
  get_data({responses, denominators, aggregations, options}) {
    // from configuration/options
    const defaults = {
      key_format: 'D MMM',
      interval: 'week',
      chart_type: 'bar',
      date_field: 'recorded_on',
    }

    options = demo_options

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

    // find the correct aggregations for the chart


    const aggregations_for_chart = options.series.map(ser => {
      return {
        aggregation: aggregations.find(i => i.name === ser.name),
        colour: ser.colour
      }
    })

    // calculate rolled-up value for each bin
    return aggregations_for_chart.map(i => {
      const x = []
      const y = []

      filled_responses.forEach(r => {
        const value = aggregate_on({aggregation: i.aggregation, responses: r.values, denominators})
        x.push(r.key)
        y.push(value)
      })

      // shape the data to return
      return {
        x: x,
        name: i.aggregation.name,
        y: y,
        type: options.chart_type,
        marker: {color: i.colour}
      }
    })
  }
}

