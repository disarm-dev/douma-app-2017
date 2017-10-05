import test from 'ava'

import {decorate_for_table} from "apps/irs_monitor/lib/decorate_data_for_viz"
import * as exports from 'apps/irs_monitor/lib/decorate_geodata.js'

test('can mock', t => {
  exports.decorate_geodata = () => ({features: []})

  const actual = decorate_for_table({binned_responses: []})
  const expected = []

  t.deepEqual(actual, expected)
})

