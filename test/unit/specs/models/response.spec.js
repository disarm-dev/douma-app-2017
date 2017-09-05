import omit from 'lodash.omit'

import {Response} from 'lib/models/response/response.model.js'

describe('Response model', () => {

  const sample_valid_response = {
    instance_slug: 'test_instance',
    username: 'test_user',

    id: 'id',
    userAgent: 'chrome',
    recorded_on: "today",

    form_data: {},
    location: {
      coords: {
        latitude: 24,
        longitude: 31,
        accuracy: 10
      },
      selection: {
        name: "location",
        id: "1"
      }
    },
  }

  it('can create empty model with only the required parameters', () => {
    const fn = () => new Response({username: 'test_user', instance_slug: 'test_instance'})
    assert.doesNotThrow(fn)
  })

  it('cannot create a response without required parameters', () => {
    const fn = () => new Response({})
    assert.throws(fn, /ResponseSchema validation failed/)
  })

  it('create model from existing data', () => {
    const fn = () => {
      new Response(sample_valid_response)
    }

    assert.doesNotThrow(fn)
  })

  it('creates a valid response by adding missing properties from defaults', () => {
    const missing_location = omit(sample_valid_response, 'location')

    const fn = () => {
      new Response(missing_location)
    }

    assert.doesNotThrow(fn, /ResponseSchema validation failed/)
  })

  it('should create a recorded_on and/or id property if none is passed', () => {
    const response_missing_fields  = omit(sample_valid_response, 'id', 'recorded_on')
    const response = new Response(response_missing_fields)
    assert.property(response.model, 'id')
    assert.property(response.model, 'recorded_on')
  })

})
