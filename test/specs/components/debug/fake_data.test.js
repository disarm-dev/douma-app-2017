import test from 'ava'

import * as exports from 'lib/models/geodata/geodata.valid'

test('can mock an import', t => {
  exports.geodata_in_cache_and_valid = () => true
  const actual = exports.geodata_in_cache_and_valid()
  t.true(actual)
})