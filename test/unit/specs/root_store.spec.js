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
        assert.equal(callback.calledWith({success: true}), true)
        assert.equal(callback.called, true)
        done()
      })
    })

  })

  describe('need_to_update', () => {

    it("should return can update if versions don't match", (done) => {
      const instance_config = {}
      const instance_stores = {}
      const store = create_store(instance_config, instance_stores)

      const callback = sinon.spy()

      store.dispatch('need_to_update').then(callback)

      moxios.wait(function () {
        let request = moxios.requests.mostRecent()
        request.respondWith({
          status: 200,
          response: 'not_real_version'
        }).then(function () {
          const expected = {status: 'CAN_UPDATE', local_version: VERSION_COMMIT_HASH_SHORT, remote_version: 'not_real_version'}

          assert.equal(callback.called, true)
          assert.deepEqual(expected, callback.getCall(0).args[0])

          done()
        })
      })
    })

    it("should return can update if versions don't match", (done) => {
      const instance_config = {}
      const instance_stores = {}
      const store = create_store(instance_config, instance_stores)

      const callback = sinon.spy()

      store.dispatch('need_to_update').then(callback)

      moxios.wait(function () {
        let request = moxios.requests.mostRecent()
        request.respondWith({
          status: 200,
          response: VERSION_COMMIT_HASH_SHORT
        }).then(function () {
          const expected = {status: 'ON_LATEST', local_version: VERSION_COMMIT_HASH_SHORT, remote_version: VERSION_COMMIT_HASH_SHORT}

          assert.equal(callback.called, true)
          assert.deepEqual(expected, callback.getCall(0).args[0])

          done()
        })
      })
    })

  })
})
