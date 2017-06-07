import moment from 'moment'

import {get_all_records} from '@/lib/data/remote'

export default {
  namespaced: true,
  state: {
    responses: [],
    filters: []
  },
  mutations: {
    set_responses: (state, responses) => {
      state.responses = responses
    },
    toggle_filter: (state, filter) => {
      let index = state.filters.findIndex(f => f.type === filter.type && f.value === filter.value)
      if (index === -1) {
        state.filters.push(filter)
      } else {
        state.filters.splice(index, 1)
      }
    },
    remove_filter: (state, type) => {
      state.filters = state.filters.filter((f) => {
        return f.type !== type
      })
    }
  },
  actions: {
    get_all_records: (context) => {
      const country = context.rootState.instance_config.slug
      return get_all_records(country).then(records => {
        const responses = records.map(r => {
          r.week = moment(r.recorded_on).week()
          return r
        })
        console.log(responses)
        context.commit('set_responses', responses)
      })
    }
  }
}
