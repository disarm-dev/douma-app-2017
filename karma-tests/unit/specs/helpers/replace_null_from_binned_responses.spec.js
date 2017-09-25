import {replace_null_key_in_binned_responses} from "apps/irs_monitor/lib/get_data_for_viz"

describe('replace null from binned responses', () => {
  it("replaces null with 'other'", () => {
    const bins = [
      {
        key: 'null'
      },
      {
        key: 'something else'
      }
    ]

    const replace_with = 'test'

    const result = replace_null_key_in_binned_responses(bins, replace_with)

    assert.equal(result[0].key, replace_with)
  })

  it('does nothing to bins without the key null', () => {
    const bins = [
      {
        key: 'not null'
      },
      {
        key: 'something else'
      }
    ]

    const replace_with = 'test'

    const result = replace_null_key_in_binned_responses(bins, replace_with)

    assert.deepEqual(result, bins)

  })

})
