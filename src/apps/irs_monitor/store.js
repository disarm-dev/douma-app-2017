import {get_all_records} from 'lib/models/response/remote'
import {get_current_plan} from 'lib/models/plan/remote'
import {Plan} from 'lib/models/plan/model'
import {decorate_responses_from_json} from 'lib/models/response/decorator'
import instance_decorator from 'lib/models/response/decorators-evaluated'
import {set_filter, unset_filter} from './pages/controls/filters/controller'
import CONFIG from 'config/common'

export default {
  namespaced: true,
  state: {
    ui: {

    },
    responses: [],
    responses_last_updated_at: null,
    filters: [],
    plan: null,
    filter: null,
    map_options: {
      show_response_points: true, 
      selected_layer: 'risk'
    },

    dashboard_options: {
      // TODO: @config Extract default temporal_aggregation_level
      temporal_aggregation_level: CONFIG.applets.irs_monitor.defaults.temporal_aggregation_level,
      spatial_aggregation_level: null,
      limit_to_plan: false
    }
  },
  mutations: {
    // clear storage (called by meta store)
    clear_data_storage:(state) => {
      state.responses = []
      state.responses_last_updated_at = null
      state.filters = []
      state.plan = null
    },
    // set responses
    set_responses: (state, responses) => {
      state.responses = responses
    },
    update_responses_last_updated_at:(state) => {
      state.responses_last_updated_at = new Date
    },
    // set plan
    set_plan: (state, plan) => {
      state.plan = plan
    },
    set_filter: (state, {filter_name, filter_object}) => {
      const new_filters = set_filter(state.filters, filter_name, filter_object)
      state.filters = new_filters
    },
    unset_filter: (state, filter_to_remove /** string: 'spatial' **/) => {
      const new_filters = unset_filter(state.filters, filter_to_remove, state.responses)
      state.filters = new_filters
    },

    set_ui: (state, ui) => {state.ui = ui},
    set_dashboard_options: (state, options) => {
      state.dashboard_options = options
    },
    set_selected_layer(state, selected_layer) {
      state.map_options.selected_layer = selected_layer
    },
    set_show_response_points(state, show_response_points) {
      state.map_options.show_response_points = show_response_points
    }
  },
  getters: {
    // Return all the targets from the plan
    targets(state, getters) {
      if(!state.plan) return []
      return state.plan.targets
    },

    plan_target_area_ids(state) {
      if (state.plan && state.plan.targets) {
        return state.plan.targets.map(target => target.id)
      } else {
        return []
      }
    },


    // Responses which are contained by current plan
    // ideally, filtered_responses should change in response to the
    // settings of the filter e.g. "locality #2"
    filtered_responses(state, getters, rootState) {
      if (!state.responses.length) return []

      const filtered = state.responses.filter(response => {
        return true
        return this.filters.all(filter => {
          filter.field
          filter.value
        })
      })

      // Run instance decorator on all responses
      const decorated_responses = instance_decorator(filtered, rootState.instance_config)

      return decorated_responses
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
