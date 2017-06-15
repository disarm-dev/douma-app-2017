import moment from 'moment'

import {get_all_records, get_current_plan} from 'lib/data/remote'

export default {
  namespaced: true,
  state: {
    responses: [],
    filters: [],
    plan: null
  },
  mutations: {
    set_responses: (state, responses) => {
      state.responses = responses
    },
    set_plan: (state, plan) => {

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
    },
    get_current_plan: (context) => {
      const country = context.rootState.instance_config.slug
      return get_current_plan(country)
        // If we want, for debug
        // plan = {...plan, population: 500, structures_targeted: 150}
        .then(plan => context.commit('set_plan', plan))
    }
  }
}
