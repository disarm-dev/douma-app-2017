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
    assert.equal(4, bins.length)
  })

  it('can calculate weekly bins', () => {
    const temporal_filter_definition = {interval: 'weeks'}

    const bins = get_temporally_binned_aggregations({responses: test_responses, temporal_filter_definition})
    assert.equal(14, bins.length)
  })

})
