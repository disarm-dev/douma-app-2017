import test from 'ava'
import {spatial_bin, spatially_decorate_responses} from "lib/helpers/spatial_binning"
import {configure_spatial_helpers} from "lib/instance_data/spatial_hierarchy_helper"

test('should return binned responses', t => {
  const responses = [{id: 1}, {id: 2}]

  const expected = [{key: 'undefined', values: [{id: 1}, {id: 2}]}]

  const actual = spatial_bin(responses)

  t.deepEqual(actual, expected)
})

test('should bin responses according to their area', t => {
  const responses = [{id: 1, aggregation_field: 1}, {id: 2, aggregation_field: 1}, {id: 3, aggregation_field: 2}]

  const expected = [
    {key: '1', values: [{id: 1, aggregation_field: 1}, {id: 2, aggregation_field: 1}]},
    {key: '2', values: [{id: 3, aggregation_field: 2}] }
  ]

  const actual = spatial_bin(responses)

  t.deepEqual(actual, expected)
})

test.failing('should decorate responses with the area they are in', t => {
  // Configure spatial_hierarchies
  const instance_config = {
    spatial_hierarchy: {
      levels: [
        {
          name: 'level_1',
          field_name: 'level_1_field_name'
        }
      ]
    }
  }
  configure_spatial_helpers(instance_config)

  // Setup geodata that matches spatial_hierarchy


  // Create responses that lie within the geodata specified above

  // run function
  //const bins = spatially_decorate_responses(responses, 'level_1')


  // verify there are as many bins as there are responses for each area

})
