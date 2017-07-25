import {get_temporally_binned_aggregations} from 'lib/binning/temporal_bins'

describe('temporal_bin', () => {
  const test_responses = [
    {
      recorded_on: '2017-01-01',
      value: 1
    },
    {
      recorded_on: '2017-01-21',
      value: 1
    },
    {
      recorded_on: '2017-04-02',
      value: 1
    },
    {
      recorded_on: '2017-02-15',
      value: 1
    },
    {
      recorded_on: '2017-03-15',
      value: 1
    }
  ]

  it('defaults to monthly bins', () => {
    const bins = get_temporally_binned_aggregations({responses: test_responses})

    assert.deepEqual(bins[0], {time_slice: '2017-01-01', sum_of_values: 2})
    assert.equal(bins.length, 4)
  })

  it('can calculate weekly bins', () => {
    const temporal_filter_definition = {interval: 'weeks'}
    const bins = get_temporally_binned_aggregations({responses: test_responses, temporal_filter_definition})

    assert.deepEqual(bins[0], {time_slice: '2016-12-26', sum_of_values: 1})
    assert.equal(bins.length, 14)
  })

  it('can work with other test_responses too ;-)', () => {
    const other_test_responses = [
      {
        recorded_on: '2017-07-01',
        value: 1
      }, {
        recorded_on: '2017-08-01',
        value: 2
      }
    ]

    const bins = get_temporally_binned_aggregations({responses: other_test_responses})

    assert.deepEqual(bins[0], {time_slice: '2017-07-01', sum_of_values: 1})
    assert.equal(bins.length, 2)
  })

})
