import Vue from 'vue'
import location from '@/components/location.vue'
import sinon from 'sinon'
import geolocate from 'mock-geolocation'
import defer from 'lodash.defer'

describe('location.vue', () => {
  const Constructor = Vue.extend(location)

  it('should be able to find geolocation in navigator', () => {
    geolocate.use()
    assert.isTrue("geolocation" in navigator)
  })

  it('should start with `location_mode` set to "point"', () => {
    geolocate.use()
    const vm = new Constructor().$mount()
    assert.equal(vm.location_mode, "point")
  })

  it('should set `location_mode` to "text" if geolocation API not available', () => {
    navigator = {}
    const vm = new Constructor().$mount()
    assert.equal(vm.location_mode, "text")
  })

  it('should show text input if geolocation API not available', (done) => {
    navigator = {}
    const vm = new Constructor().$mount()
    Vue.nextTick(() => {
      assert.equal(vm.$el.querySelector('input').style.display, '')
      done()
    })
  })

  it('should not render input box if geolocation API is available', () => {
    const vm = new Constructor().$mount()
    assert.equal(vm.$el.querySelector('input').style.display, 'none')
  })

  it('should call get_location on `mounted`', () => {
    const geolocation_spy = sinon.spy()
    navigator.geolocation = {getCurrentPosition: geolocation_spy}
    const vm = new Constructor().$mount()
    assert(geolocation_spy.called, 'navigator.geolocation.getCurrentPosition is not called on `mount`')
  })

  it('should display coordinates if position found', () => {
    geolocate.use()
    const vm = new Constructor().$mount()
    const coords = {lat: 1, lng: 1}
    geolocate.send(coords)
    defer(() => {
      assert.equal(vm.position, coords)
      geolocate.restore()
    })
  })

  // `emit` any location found, or text entered
  // display errors if API errors found
  // show text input if `getCurrentLocation` fails
  // set and return `existing_location` if passed in

  // user can trigger new getCurrentPosition by clicking button
  it('can receive a click', () => {
    assert(true)
  })

})
