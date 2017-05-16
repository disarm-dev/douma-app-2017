import Vue from 'vue'
import location from '@/components/location.vue'
import sinon from 'sinon'

describe('location.vue', () => {
  const Constructor = Vue.extend(location)
  it('should call get_location on `mounted`', () => {
    const geolocation_spy = sinon.spy()
    navigator.geolocation = {getCurrentPosition: geolocation_spy}
    const vm = new Constructor().$mount()
    assert(geolocation_spy.called, 'navigator.geolocation.getCurrentPosition is not called on `mount`')
  })

  it('should start with `location_mode` set to "point"', () => {
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

  // show text input if `getCurrentLocation` fails
  // set `existing_location` if passed in by

})
