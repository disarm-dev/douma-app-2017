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

  it('should filter responses using an equality filter', () => {
    const responses = [
      { name: 1 },
      { name: 2 },
      { name: 3 }
    ]

    const filter = {name: "name", comparator: "==", value: 2}

    const result = filter_responses(responses, [filter])

    const expected = [
      { name: 2 }
    ]

    assert.deepEqual(result, expected)
  })

  it('should filter responses using a greater than filter', () => {
    const responses = [
      { name: 1 },
      { name: 2 },
      { name: 3 }
    ]

    const filter = {name: "name", comparator: ">", value: 2}

    const result = filter_responses(responses, [filter])

    const expected = [
      { name: 3 }
    ]

    assert.deepEqual(result, expected)
  })

  it('should filter responses using a smaller than filter', () => {
    const responses = [
      { name: 1 },
      { name: 2 },
      { name: 3 }
    ]

    const filter = {name: "name", comparator: "<", value: 2}

    const result = filter_responses(responses, [filter])

    const expected = [
      { name: 1 }
    ]

    assert.deepEqual(result, expected)
  })
})
