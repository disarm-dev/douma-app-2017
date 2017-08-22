import moment_original from 'moment'
import {extendMoment} from 'moment-range'
const moment = extendMoment(moment_original)

import {nest} from 'd3-collection'
import {ascending} from 'd3-array'

import {aggregate_on} from 'lib/instance_data/aggregator'

export default {
  get_data({responses, denominators, aggregations}) {
    // set intervals (and account for weeks starting on sunday)
    const interval = 'week'
    const moment_interval = interval === 'week' ? 'isoWeek' : interval

    // debug
    // const oldkey = binned_responses[binned_responses.length - 1].key
    // const newkey = moment(oldkey).add(2, 'month').format()
    // const extrakey = moment(oldkey).add(1, 'month').format()
    // console.log('extrakey', extrakey)
    // binned_responses[binned_responses.length - 1].key = newkey
    // binned_responses.push({key: extrakey, values: []})
    // responses.push({recorded_on: "2017-11-25T12:02:04.477Z", form_data: {}})
    // responses.push({recorded_on: "2017-10-18T12:02:04.477Z", form_data: {}})


    // split/bin into series
    const binned_responses = nest()
      .key(f => {
        const raw_date = f.recorded_on
        return moment(raw_date).startOf(moment_interval).format()
      })
      .sortKeys(ascending)
      .entries(responses)

    binned_responses.splice(1,1)
    // console.log('binned_responses', binned_responses)
    // debugger


    // fill any gaps in timeseries
    const earliest = binned_responses[0].key
    const latest = binned_responses[binned_responses.length - 1].key
    const date_range = moment.range(earliest, latest)
    console.log('earliest, latest', earliest, latest)

    let filled_responses = []

    for (let step_date of date_range.by(interval)) {
      const week_commencing = moment(step_date).format()
      const step_date_formatted = moment(step_date).format('D MMM')
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
    debugger

    // find the correct aggregations for the chart
    const aggregations_for_chart = [{
      aggregation: aggregations.find(i => i.name === 'structures sprayed'),
      colour: 'green'
    },{
      aggregation: aggregations.find(i => i.name === 'sprayable structures not sprayed'),
      colour: 'red'
    }]

    return aggregations_for_chart.map(i => {
      // calculate rolled-up value for each bin
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
        type: 'bar',
        marker: {color: i.colour}
      }
    })
  }
}

