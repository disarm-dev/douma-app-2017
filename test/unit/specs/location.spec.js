import Vue from 'vue'
import location from 'location_coords.vue'
Vue.config.devtools = false

import geolocate from 'mock-geolocation'

describe('location.vue', () => {
  const Constructor = Vue.extend(location)

  beforeEach(() => {
    geolocate.use()
  })

  afterEach(() => {
    geolocate.restore()
  })

  it('geolocate can be mocked', (done) => {
    const point = [12.34, 56.78];

    assert.property(navigator, 'geolocation')
    assert.isFunction(navigator.geolocation.getCurrentPosition)

    navigator.geolocation.getCurrentPosition((position) => {
      assert.equal(position.coords.latitude, point[0]);
      assert.equal(position.coords.longitude, point[1]);
      done()
    }, (error) => done())
    geolocate.send({lat: point[0], lng: point[1]});
  })

  it('should have null position to start', () => {
    const defaultData = location.data()
    assert.equal(defaultData.position, null)
  })

  it('should be able to find geolocation in navigator', () => {
    assert.isTrue("geolocation" in navigator)
  })
})
