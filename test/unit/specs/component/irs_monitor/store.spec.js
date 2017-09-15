import Vue from 'vue'
import Vuex from 'vuex'
import {cloneDeep} from 'lodash'
import irs_monitor_store from 'apps/irs_monitor/store'

Vue.use(Vuex)

describe('monitor store', () => {
  it('can make store', () => {
    const store = new Vuex.Store(cloneDeep(irs_monitor_store))

    assert.equal(store.state.map_options.selected_layer, 'normalised_risk')
  })

  it('should change state after commit', () => {
    const responses = [{name: 1}, {name: 2}]
    const store = new Vuex.Store(cloneDeep(irs_monitor_store))

    store.commit('set_responses', responses)

    assert.deepEqual(store.state.responses, responses)
    assert.lengthOf(store.state.responses, 2)
  })

  it('should add a filter to the filters array', () => {
    const filter = {name: 'filter_name', comparator: 'eq', value: 'filter_value'}
    const store = new Vuex.Store(cloneDeep(irs_monitor_store))


    assert.lengthOf(store.state.filters, 0)

    store.commit('add_filter', filter)

    assert.lengthOf(store.state.filters, 1)

    assert.deepEqual(store.state.filters[0], filter)
  })

  it('should remove a filter from the filters array', () => {
    const filters = [
      {name: 'filter_name', comparator: 'eq', value: 'filter_value'},
      {name: 'filter_name2', comparator: 'eq', value: 'filter_value2'},
      {name: 'filter_name3', comparator: 'eq', value: 'filter_value3'}
    ]

    const store = new Vuex.Store(cloneDeep(irs_monitor_store))

    assert.lengthOf(store.state.filters, 0)

    filters.forEach(filter => store.commit('add_filter', filter))

    assert.lengthOf(store.state.filters, 3)

    store.commit('remove_filter', filters[0])

    assert.lengthOf(store.state.filters, 2)

    assert.equal(store.state.filters.indexOf(filters[0]), -1)

  })
})
