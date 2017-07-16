import moment from 'moment'

import {get_all_records, get_current_plan} from 'lib/remote/remote'
import {Plan} from 'lib/models/plan.model'
import {decorate_responses_from_json} from 'lib/models/response.model'
import Presenters from 'lib_instances/presenters'

export default {
  namespaced: true,
  state: {
    responses: [],
    responses_last_updated_at: null,
    filters: [],
    plan: null,
  },
  mutations: {
    clear_data_storage:(state) => {
      state.responses = []
      state.responses_last_updated_at = null
      state.filters = []
      state.plan = null
    },
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
    plan_target_area_ids(state) {
      if (state.plan && state.plan.targets) {
        return state.plan.targets.map(target => target.id)
      } else {
        return []
      }
    },

    /**
     * Takes all the responses.
     * Aggregates them by time and space.
     * @param state
     * @returns {{time_slices: Array, spatial_aggregations: Array}}
     */
    binned_responses(state) {
      const filter_definitions = {}
      return {time_slices: [], spatial_aggregations: []}
    },

    // Responses which are contained by current plan
    // ideally, filtered_responses should change in response to the
    // settings of the filter e.g. "locality #2"
    filtered_responses(state) {
      if (!state.plan) return []
      if (!state.responses.length) return []

      return state.responses.filter(response => {
        // TODO: @debug This first filter is more of a DEBUG filter, making sure we have valid responses
        return Object.keys(response.location_selection).length !== 0 // TODO: @feature Add actual filtering
          && state.plan.targets.find(t => t.id === response.location_selection.id)
      })
    },

    // Currently this is just all the targets from the plan
    // We need this to be aggregated to the same level as the current
    // filter - e.g. if filtering at "region #2", but the target_areas in
    // the plan are "locality" then aggregate up from locality -> region level
    aggregated_denominators(state, getters) {
      if(!state.plan) return []
      // TODO: @feature Aggregate from plan target_areas up to current filter level
      // e.g. from locality to region level
      return state.plan.targets
    },

    // We need to get agregations at the level below the filtered level.
    // e.g. filter "locality #1", so calculate the coverage for each of the next level down
    // which is "structure-clusters".
    aggregated_responses(state, getters, rootState) {
      if(!getters.filtered_responses.length || !getters.aggregated_denominators.length) return []

      const instance_presenters = new Presenters[rootState.instance_config.instance.slug](rootState.instance_config) // TODO: @refac Improve Presenters signature, remove duplication
      const data = instance_presenters.get_aggregated_responses({
        responses: getters.filtered_responses,
        denominators: getters.aggregated_denominators,
        instance_config: rootState.instance_config
      })
      return data
    },

  },
  actions: {
    get_all_records: (context) => {
      const country = context.rootState.instance_config.instance.slug
      return get_all_records(country).then(res=> {
        const responses = decorate_responses_from_json(res, context.rootState.instance_config)
        context.commit('update_responses_last_updated_at')
        context.commit('set_responses', responses)
      })
    },
    get_current_plan: (context) => {
      const country = context.rootState.instance_config.instance.slug
      return get_current_plan(country)
        .then(plan_json => {
          try {
            new Plan().validate(plan_json)
            context.commit('set_plan', plan_json)
          } catch (e) {
            console.error(e)
            context.commit('root:set_snackbar', {message: 'ERROR: Plan is not valid'}, {root: true})
          }

        })
    }
  }
}
