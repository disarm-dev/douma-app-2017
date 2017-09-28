import test from 'ava'
import {spatial_bin} from "lib/helpers/spatial_binning"

test('should return binned responses', t => {
  const responses = [{id: 1}, {id: 2}]

  const expected = [{key: 'undefined', values: [{id: 1}, {id: 2}]}]

  const actual = spatial_bin(responses)

  t.deepEqual(actual, expected)
})

test('shoudl bin responses according to their area', t => {
  const responses = [{id: 1, aggregation_field: 1}, {id: 2, aggregation_field: 1}, {id: 3, aggregation_field: 2}]

  const expected = [
    {key: '1', values: [{id: 1, aggregation_field: 1}, {id: 2, aggregation_field: 1}]},
    {key: '2', values: [{id: 3, aggregation_field: 2}] }
  ]

  const actual = spatial_bin(responses)

  t.deepEqual(actual, expected)
})

// test('should return id for aggregation level area for a single response', t => {
//
// })
