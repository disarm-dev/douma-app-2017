import {Response} from 'models/response.model.js'

describe('Response model', () => {
  
  it('exising data can be edited as response model', () => {
    const fn = () => {
      new Response().create({
        id: 'id',
        country: 'bobland',
        userAgent: 'chrome',
        user: 'bob',
        recorded_on: "today",

        form_data: {},
        location: {
          coords: {
            latitude: 24,
            longitude: 31,
            accuracy: 10
          },
        },
        location_selection: {
          name: "location",
          id: "1"
        }
      })
    }

    assert.doesNotThrow(fn, 'Should throw no errors for correct schema')
  })

  it('should throw an error if location is missing', () => {
    const country = 'bobland'
    const user = "bob"
    const userAgent = "chrome"

    const fn = () => {
      new Response().create({
        id: 'id',
        country: 'bobland',
        userAgent: 'chrome',
        user: 'bob',
        recorded_on: "today",

        form_data: {},
        location_selection: {
          name: "location",
          id: "1"
        }    
      })
    }

    assert.throws(fn, /ResponseSchema validation failed/)
  })

  it('should create a recorded_on and/or id property if none is passed', (done) => {
    const fn = () => {
      let response = new Response().create({
        country: 'bobland',
        userAgent: 'chrome',
        user: 'bob',
        form_data: {},
        location: {
          coords: {
            latitude: 24,
            longitude: 31,
            accuracy: 10
          },
        },
        location_selection: {
          name: "location",
          id: "1"
        }
      })

      assert.property(response, 'recorded_on', "Should have a `recorded_on` property if none is passed")
      assert.property(response, 'id', "Should have a `id` property if none is passed")
    }

    assert.doesNotThrow(fn, 'Should throw no errors if recorded_on or id is missing')
    done()
  })

})
