import {get_all_records} from 'lib/remote/remote.records'
import {get_current_plan} from 'lib/remote/remote.plans'
import {Plan} from 'lib/models/plan.model'
import {decorate_responses_from_json} from 'lib/models/response.model'
import Presenters from 'lib/instance_data/presenters'

export default {
  namespaced: true,
  state: {
    responses: [],
    responses_last_updated_at: null,
    filter: null,
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
    update_responses_last_updated_at:(state) => {
      state.responses_last_updated_at = new Date
    },
    set_plan: (state, plan) => {
      state.plan = plan
    },
    set_filter: (state, filter) => {
      state.filter = filter
    },
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
        return (response.location.selection) // TODO: @feature Add actual filtering
          && state.plan.targets.find(t => t.id === response.location.selection.id)
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

      const instance_presenters = new Presenters(rootState.instance_config) // TODO: @refac Improve Presenters signature, remove duplication

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
      const instance_slug = context.rootState.instance_config.instance.slug
      return get_all_records(instance_slug).then(res=> {
        const responses = decorate_responses_from_json(res, context.rootState.instance_config)
        context.commit('update_responses_last_updated_at')
        context.commit('set_responses', responses)
      })
    },
    get_current_plan: (context) => {
      const instance_slug = context.rootState.instance_config.instance.slug
      return get_current_plan(instance_slug)
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
