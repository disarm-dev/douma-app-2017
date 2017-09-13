import {categorical_bins} from "apps/irs_monitor/lib/bin_responses"

describe('categorical bins', () => {

  it('bins responses based on a string in options.bin_by', () => {
    const responses = [
      {type: 1},
      {type: 2},
      {type: 1}
    ]
    const options = {
      bin_by: 'type'
    }
    const result = categorical_bins({responses, options})

    assert.lengthOf(result, 2)
    assert.lengthOf(result[0].values, 2)

    assert.equal(result[0].key, 1)
    assert.equal(result[1].key, 2)
  })

  it('should throw when no options are passed in', () => {
    const responses = [
      {type: 1},
      {type: 2},
      {type: 1}
    ]
    const fn = categorical_bins.bind(this, {responses})
    assert.throws(fn, 'Missing options.bin_by')
  })

})
