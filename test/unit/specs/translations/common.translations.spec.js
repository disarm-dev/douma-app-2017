import BwaTranslations from 'lib/presenters/bwa.presenters.js'
import NamTranslations from 'lib/presenters/nam.presenters.js'
import SwzTranslations from 'lib/presenters/swz.presenters.js'
import ZweTranslations from 'lib/presenters/zwe.presenters.js'

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

  xdescribe(`${instance_name.toUpperCase()} translations`, () => {

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
