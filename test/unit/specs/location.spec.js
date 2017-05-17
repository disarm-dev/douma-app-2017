import Vue from 'vue'
import location from '@/components/location.vue'
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
    const point = [54.980206086231, 82.898068362003];

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

  it('should start with `location_mode` set to "point"', () => {
    const vm = new Constructor().$mount()
    assert.equal(vm.location_mode, "point")
  })

  it('should not render input box if geolocation API is available', () => {
    const vm = new Constructor().$mount()
    assert.equal(vm.$el.querySelector('.md-input-container').style.display, 'none')
  })

  it('should set position if position found', () => {
    const vm = new Constructor().$mount()
    const coords = {latitude: 2, longitude: 2}
    geolocate.send(coords)
    assert.equal(vm.position.coords.latitude, coords.latitude)
    assert.equal(vm.position.coords.longitude, coords.longitude)
  })

  it('should display coordinates if position found', (done) => {
    const vm = new Constructor().$mount()
    const coords = {latitude: 2, longitude: 2}
    assert.equal(vm.$el.querySelector('p').style.display, 'none')
    geolocate.send(coords)
    Vue.nextTick(() => {
      assert.equal(vm.$el.querySelector('p').style.display, '')
      done()
    })
  })
  // should display coordinates if position found
  // `emit` any location found, or text entered
  // display errors if API errors found
  // show text input if `getCurrentLocation` fails
  // set and return `existing_location` if passed in

  // user can trigger new getCurrentPosition by clicking button
  it('can receive a click', () => {
    assert(true)
  })

})
