import {nest} from 'd3-collection'
import {ascending} from 'd3-array'

import {aggregate_on} from 'lib/instance_data/aggregator'

export default {
  get_data({responses, denominators, aggregations}) {
    // split/bin into series
    const binned_responses = nest()
      .key(f => f.team_name)
      .sortKeys(ascending)
      .entries(responses)

    // find the right aggregation for the chart
    const aggregation = aggregations.find(i => i.name === 'structures sprayed')

    // calculate rolled-up value for each bin
    return binned_responses.map(r => {
      const value = aggregate_on({aggregation, responses: r.values, denominators})
      return {
        x: [r.key],
        name: r.key,
        y: [value],
        type: 'bar'
      }
    })
  }
}

