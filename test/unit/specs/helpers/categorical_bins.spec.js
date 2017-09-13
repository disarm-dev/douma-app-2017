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

  it('should throw error if options.bin_by string is empty', () => {
    const responses = []
    const options = {
      bin_by: ''
    }
    const fn = categorical_bins.bind(this, {responses, options})
    assert.throws(fn, 'bin_by must not be an empty string or empty array')
  })

  it('should throw error if options.bin_by array is empty', () => {
    const responses = []
    const options = {
      bin_by: []
    }
    const fn = categorical_bins.bind(this, {responses, options})
    assert.throws(fn, 'bin_by must not be an empty string or empty array')
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
    it('should return 1 bin for 1 array entry', () => {
      const responses = [
        {custom_name1: 1},
        {custom_name1: 2}
      ]
      const options = {
        bin_by: ['custom_name1']
      }
      const result = categorical_bins({responses, options})

      assert.lengthOf(result, 1)
      assert.equal(result[0].key, 'custom_name1')
      assert.deepEqual(result[0].values, responses)
    })

    it('should return 2 bins for 2 array entries', () => {
      const responses = [
        {custom_name1: 1, custom_name2: 1},
        {custom_name1: 2, custom_name2: 1}
      ]
      const options = {
        bin_by: ['custom_name1', 'custom_name2']
      }
      const result = categorical_bins({responses, options})

      assert.lengthOf(result, 2)
      assert.equal(result[0].key, 'custom_name1')
      assert.equal(result[1].key, 'custom_name2')
    })
  })


})
