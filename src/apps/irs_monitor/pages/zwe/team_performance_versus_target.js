import {nest} from 'd3-collection'
window.n = nest

export default {
  get_data({responses, denominator, aggregations}) {
    // input_data === filtered_responses
    // use the aggregator

    // format data into right format for chart
    const def = [
      {
        groupBy: 'team_name',
        def: {
          y: {
            aggregation: 'number_sprayed'
          },
          x: {
            key: 'team_name'
          },
          name: 'team_name',
          type: 'bar'
        }
      }
    ]
    




    const data = [
      {
        x: ['Team 2'],
        y: [750],
        name: 'Team 2',
        type: 'bar'
      }, {
        x: ['Team 1'],
        y: [1340],
        name: 'Team 1',
        type: 'bar'
      }
    ]

    const _data = {
      x: ['Team 1', 'Team 2'],
      y: [1340, 750],
      type: 'bar'
    }

    return data
  }
}

