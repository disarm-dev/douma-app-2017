import Translations from 'lib/presenters/zwe.presenters.js'

const fake_responses = [
  {
    form_data: {
      sprayable: 'yes',
      numbersprayed_ddt: 1,
      numbersprayed_OP: 2,
      numbersprayed_PY: 3
    }
  },{
    form_data: {
      sprayable: 'yes',
      numbersprayed_ddt: 1,
      numbersprayed_OP: 2,
      numbersprayed_PY: 3
    }
  },{
    form_data: {
      sprayable: 'no',
      numbersprayed_ddt: 0,
      numbersprayed_OP: 0,
      numbersprayed_PY: 0
    }
  }
]

xdescribe(`ZWE translations detailed`, () => {
  it('sprayed_count should calculate correctly', () => {
    const t = new Translations({responses: fake_responses})
    assert.equal(t.sprayed_count(), 12)
  })
})
