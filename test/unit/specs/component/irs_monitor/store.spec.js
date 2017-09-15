import Vue from 'vue'
import Vuex from 'vuex'
import irs_monitor_store from 'apps/irs_monitor/store'

Vue.use(Vuex)

describe('monitor store', () => {
  it('can make store', () => {
    const store = new Vuex.Store(irs_monitor_store)

    assert.equal(store.state.map_options.selected_layer, 'normalised_risk')
  })

  it('should change state after commit', () => {
    const responses = [{name: 1}, {name: 2}]
    const store = new Vuex.Store(irs_monitor_store)

    store.commit('set_responses', responses)

    assert.deepEqual(store.state.responses, responses)
    assert.lengthOf(store.state.responses, 2)
  })
})
