import {Aggregator} from 'lib/instance_data/aggregations'

describe('aggregations.js', () => {
  // Aggregator needs:
  // - Aggregations
  // - Responses
  // - Denominators

  const aggregations = {
    "structures found": {
      "numerator_expr": "number_sprayable + number_unsprayable"
    }
  }

  const denominators = [{
    number_of_households: 31,
    id: "1",
    assigned_to_team_name: 'Team 1'
  }]

  const responses = [
    {
      form_data: {
        "number_sprayable": 1,
        "number_unsprayable": 2
        // 3
      }
    },
    {
      form_data: {
        "number_sprayable": 2,
        "number_unsprayable": 1
        //3 
      }
    },
    {
      form_data: {
        "number_sprayable": 3,
        "number_unsprayable": 1
        // 4
      }
    }
  ]



  it('should calculate the correct aggregation for the data provided', () => {
    const aggregator = new Aggregator(aggregations)
    const result = aggregator.calculate({responses, denominators, aggregation_name: "structures found"})
    assert.equal(result, 10)
  })
})
