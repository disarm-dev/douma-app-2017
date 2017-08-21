import moment from 'moment'
import {nest} from 'd3-collection'
import {ascending} from 'd3-array'

import {aggregate_on} from 'lib/instance_data/aggregator'

export default {
  get_data({responses, denominators, aggregations}) {
  //   // split/bin into series
    const binned_responses = nest()
      .key(f => {
        const raw_date = f.recorded_on
        return moment(raw_date).startOf('isoWeek')
      })
      .sortKeys(ascending)
      .entries(responses)
      .map(array => {
        array.key = moment(parseInt(array.key, 10)).format('D MMM')
        return array
      })

    // find the right aggregation for the chart
    const do_these = [{
      aggregation: aggregations.find(i => i.name === 'structures sprayed'),
      colour: 'green'
    },{
      aggregation: aggregations.find(i => i.name === 'sprayable structures not sprayed'),
      colour: 'red'
    }]

    const result = do_these.map(i => {
      // calculate rolled-up value for each bin
      const x = []
      const y = []

      binned_responses.forEach(r => {
        const value = aggregate_on({aggregation: i.aggregation, responses: r.values, denominators})
        x.push(r.key)
        y.push(value)
      })

      return {
        x: x,
        name: i.aggregation.name,
        y: y,
        type: 'bar',
        marker: {color: i.colour}
      }
    })

    return result
  }
}

