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

  describe('filters', () => {
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

  describe('responses', () => {
    const responses = [
      {id: 1, question: 2},
      {id: 2, question: 2},
      {id: 3, question: 3}
    ]

    it('should return all responses with no filters', () => {
      const store_content = cloneDeep(irs_monitor_store)
      store_content.state.responses = responses

      const store = new Vuex.Store(store_content)

      assert.lengthOf(store.getters.filtered_responses, 3)
    })


    it('should filter responses when filters are present returning 1 response', () => {
      const filter = {name: 'id', comparator: 'eq', value: 2}
      const store_content = cloneDeep(irs_monitor_store)

      store_content.state.responses = responses
      store_content.state.filters = [filter]

      const store = new Vuex.Store(store_content)
      assert.lengthOf(store.getters.filtered_responses, 1)
    })

    it('should filter responses when filters are present returning more than 1 response', () => {
      const filter = {name: 'question', comparator: 'eq', value: 2}
      const store_content = cloneDeep(irs_monitor_store)

      store_content.state.responses = responses
      store_content.state.filters = [filter]

      const store = new Vuex.Store(store_content)
      assert.lengthOf(store.getters.filtered_responses, 2)
    })

    it('should filter responses according to plan', () => {
      const plan = {
        targets: [{id: 1},{id: 2},{id: 3}]
      }

      const local_responses = [
        {location_selection: {id: 1}},
        {location_selection: {id: 2}},
        {location_selection: {id: 3}},
        {location_selection: {id: 4}}
      ]

      const store_content = cloneDeep(irs_monitor_store)
      store_content.state.plan = plan
      store_content.state.responses = local_responses
      store_content.state.dashboard_options.limit_to_plan = true

      const store = new Vuex.Store(store_content)

      assert.equal(store.getters.filtered_responses.length, 3)
    })

  })
})
