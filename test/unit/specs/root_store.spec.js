import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import sinon from 'sinon'
import {create_store} from "apps/store"


Vue.use(Vuex)

describe('root store', () => {

  it('can make store', () => {
    const instance_config = {}
    const instance_stores = {}

    assert.doesNotThrow(create_store.bind(this, instance_config, instance_stores))
  })


  it('can call standard handler', (done) => {
    const sandbox = sinon.sandbox.create()
    const resolved = new Promise((r) => r({ data: [1,2,3,4,5] }));
    sandbox.stub(axios, 'get').returns(resolved);

    const instance_config = {}
    const instance_stores = {}
    const store = create_store(instance_config, instance_stores)

    store.dispatch('standard_handler', {url: 'http://disarm.io'}).then(res => {
      assert.deepEqual(res, [1,2,3,4,5])
      done()
    })



  })
})
