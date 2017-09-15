import {filter_responses} from "apps/irs_monitor/lib/filters"

describe('filter_responses.js', () => {
  it('should return all responses if no filters are passed', () => {
    const responses = [
      { name: 1 },
      { name: 2 },
      { name: 3 }
    ]

    const result = filter_responses(responses)

    assert.deepEqual(result, responses)
  })

  it('should filter responses?', () => {
    const responses = [
      { name: 1 },
      { name: 2 },
      { name: 3 }
    ]

    const filter = {name: "name", comparator: "eq", value: 2}

    const result = filter_responses(responses, [filter])

    const expected = [
      { name: 2 }
    ]

    assert.deepEqual(result, expected)
  })
})
