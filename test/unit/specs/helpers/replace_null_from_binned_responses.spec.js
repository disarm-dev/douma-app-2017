import {remove_null_from_binned_responses} from "apps/irs_monitor/lib/get_data_for_viz"

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

    const result = remove_null_from_binned_responses(bins)

    assert.equal(bins[0].key, 'Other')
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

    const result = remove_null_from_binned_responses(bins)

    assert.deepEqual(bins, result)

  })

})
