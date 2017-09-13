import {categorical_bins} from "apps/irs_monitor/lib/bin_responses"

describe('categorical bins', () => {

  it('should throw when no options are passed in', () => {
    const responses = [
      {type: 1},
      {type: 2},
      {type: 1}
    ]
    const fn = categorical_bins.bind(this, {responses})
    assert.throws(fn, 'Missing options.bin_by')
  })

  describe('options.bin_by as string', () => {

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
  })


  describe('options.bin_by as array ', () => {
    it('should throw error if array is empty', () => {
      const responses = []
      const options = {
        bin_by: []
      }
      const fn = categorical_bins.bind(this, {responses, options})
      assert.throws(fn, 'bin_by must be a string or non-empty array')
    })

    xit('should return 1 bin for each provided array entry', () => {

    })
  })


})
