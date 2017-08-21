import {nest} from 'd3-collection'
import {aggregate_on} from '../../../../lib/instance_data/aggregator'
window.n = nest

export default {
  get_data({responses, denominators, aggregations}) {

    // const target_data = [
    //   {
    //     x: ['Team 2'],
    //     y: [750],
    //     name: 'Team 2',
    //     type: 'bar'
    //   }, {
    //     x: ['Team 1'],
    //     y: [1340],
    //     name: 'Team 1',
    //     type: 'bar'
    //   }
    // ]
    //

    //// STARTING HERE
    let data = []

    // split into series
    const binned_responses = nest().key(f => f.team_name).entries(responses) // e.g. [{key: 'Team a', values: [Responses]}, {key: 'team b', values: [Responses]}]

    for(const bin of binned_responses) {
      // get result of 'structures sprayed' aggregation
      const aggregation = aggregations.find(i => i.name === 'structures sprayed')
      const value = aggregate_on({aggregation, responses: bin.values, denominators})

      data.push({
        x: [bin.key],
        y: [value],
        name: bin.key,
        type: 'bar'
      })
    }
    return data
  }
}

