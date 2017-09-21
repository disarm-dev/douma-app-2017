import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import moxios from 'moxios'
import sinon from 'sinon'
import {create_store} from "apps/store"


Vue.use(Vuex)

describe('root store', () => {

  beforeEach(() => {
    moxios.install()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  it('can make store', () => {
    const instance_config = {}
    const instance_stores = {}

    assert.doesNotThrow(create_store.bind(this, instance_config, instance_stores))
  })


  it('can call standard handler', function(done) {
    const instance_config = {}
    const instance_stores = {}
    const store = create_store(instance_config, instance_stores)

    const callback = sinon.spy()

    store.dispatch('standard_handler', {url: '/get', options:{}}).then(callback)

    moxios.wait(function () {
      let request = moxios.requests.mostRecent()
      request.respondWith({
        status: 200,
        response: {success: true}
      }).then(function () {
        assert.equal(callback.called, true)
        done()
      })
    })

  })
})
