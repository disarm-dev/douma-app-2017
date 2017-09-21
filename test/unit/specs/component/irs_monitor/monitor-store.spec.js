import Vuex from 'vuex'
import moxios from 'moxios'
import sinon from 'sinon'

import {create_store} from "apps/store"
import monitor_store from 'apps/irs_monitor/store'

describe('monitor store', () => {

  beforeEach(() => {
    moxios.install()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  describe('get_all_records', () => {
    it('should retrieve list of responses and set them in the store', (done) => {
      const responses = [{id: 1}, {id: 2}, {id: 3}]

      const instance_config = {}
      const instance_stores = {irs_monitor: monitor_store}
      const store = create_store(instance_config, instance_stores)

      store.dispatch('irs_monitor/get_all_records')

      moxios.wait(function () {
        let request = moxios.requests.mostRecent()
        request.respondWith({
          status: 200,
          response: responses
        }).then(function () {
          const expected = responses
          const actual = store.state.irs_monitor.responses
          assert.deepEqual(expected, actual)
          done()
        })
      })

    })
  })
})