import Translations from '@/lib/translations/nam.translations.js'

const fake_responses = [
  {
    form_data: {
      sprayable: 'yes',
      numbersprayed_ddt: 1,
      numbersprayed_delta: 2,
    }
  },{
    form_data: {
      sprayable: 'yes',
      numbersprayed_ddt: 3,
      numbersprayed_delta: 4,
    }
  }
]

describe(`NAM translations detailed`, () => {
  it('sprayed_count should calculate correctly', () => {
    const t = new Translations({responses: fake_responses})
    assert.equal(t.sprayed_count(), 10)
  })
})
