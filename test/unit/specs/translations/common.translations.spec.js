import BwaTranslations from '@/lib/translations/bwa.translations.js'
import NamTranslations from '@/lib/translations/nam.translations.js'
import SwzTranslations from '@/lib/translations/swz.translations.js'
import ZweTranslations from '@/lib/translations/zwe.translations.js'

const instances = {
  // bwa: BwaTranslations,
  nam: NamTranslations,
  // swz: SwzTranslations,
  zwe: ZweTranslations
}

const required_functions = [
  'responses_count',
  'sprayed_count',
  'unsprayed_count',
  'sprayed_over_visited',
  'sprayed_over_targeted'
]

for(const instance_name in instances) {
  const InstanceTranslations = instances[instance_name]

  describe(`${instance_name.toUpperCase()} translations`, () => {

    // can create without specifying options

    describe('create simple one', () => {
      const t = new InstanceTranslations({responses: [], options: []})

      it('should return an object', () => {
        assert.isObject(t)
      })

      required_functions.forEach(fn => {
        it(`should have a ${fn} function`, () => {
          assert.isFunction(t[fn])
        })
      })
    })

    describe('bit more advanced', () => {
      it('responses_count should equal responses.length', () => {
        const t = new InstanceTranslations({responses: [1, 2, 3], options: []})
        assert.equal(t.responses_count(), 3)
      })
    })
  })
}
