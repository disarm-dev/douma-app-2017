import moment from 'moment'

import {get_all_records, get_current_plan} from 'lib/data/remote'
import {Plan} from 'lib/models/plan.model'

export default {
  namespaced: true,
  state: {
    responses: [],
    responses_last_updated_at: null,
    filters: [],
    plan: null,
  },
  mutations: {
    set_responses: (state, responses) => {
      state.responses = responses
    },
    set_plan: (state, plan) => {
      state.plan = plan
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
    },
    update_responses_last_updated_at:(state) => {
      state.responses_last_updated_at = new Date
}
  },
  getters: {
    filtered_responses(state, getters) {
      if(!state.plan || !state.responses.length) return []
      return state.responses.filter(response => {
        // TODO: @debug This first filter is more of a DEBUG filter, making sure we have valid responses
        return Object.keys(response.location_selection).length !== 0 // TODO: @feature Add actual filtering
          && state.plan.targets.find(t => t.id === response.location_selection.id)
      })
    },
    filtered_denominators(state, getters) {
      if(!state.plan) return []
      return state.plan.targets.filter(response => {
        return true // TODO: @feature Add actual filtering
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
        context.commit('update_responses_last_updated_at')
        context.commit('set_responses', responses)
      })
    },
    get_current_plan: (context) => {
      const country = context.rootState.instance_config.slug
      return get_current_plan(country)
        .then(plan_json => {
          try {
            new Plan().validate(plan_json)
          } catch (e) {
            context.commit('root:set_snackbar', {message: 'ERROR: Plan is not valid'}, {root: true})
          }

          context.commit('set_plan', plan_json)
        })
    }
  }
}
