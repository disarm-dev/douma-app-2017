import {nest} from 'd3-collection'
window.n = nest

export default {
  get_data({responses, denominator, aggregations}) {

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
    const binned_responses = nest().key('team_name').entries(responses) // e.g. [{key: 'Team a', values: [Responses]}, {key: 'team b', values: [Responses]}]

    for(bin of binned_responses) {
      // get result of 'structures sprayed' aggregation



      // const aggregation = (array_of_responses) => {
      //   return array_of_responses.reduce((acc, val) => {
      //     return val.form_data.number_sprayed + acc
      //   }, 0)
      // }

      const value = aggregation(bin.values)

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

