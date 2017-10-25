import test from 'ava'
import {determine_response} from "lib/helpers/get_current_coordinates"

test('throws an error if there are no positions', async t => {
  try {
    await determine_response([], [{error: 'error'}])
  } catch (actual) {
    const expected = {error: 'error'}
    t.deepEqual(actual, expected)
  }
})


test('throws an error if there are no positions', async t => {
  try {
    await determine_response([], [{error: 'error'}])
  } catch (actual) {
    const expected = {error: 'error'}
    t.deepEqual(actual, expected)
  }
})