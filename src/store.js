import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export function create_store(instance_stores) {
  Vue.use(Vuex)

  return new Vuex.Store({
    modules: instance_stores,
    plugins: [createPersistedState()],
    state: {
      // Global config
      instance_config: {}, // Really important, should be somewhere else

      // Global UI
      snackbar: {message: null},
      loading: false,
      sw_message: {message: 'null', title: 'null'},
      network_online: false,

      // Irrelevant values: only watched for changes
      trigger_sidebar_visible_irrelevant_value: false,
      trigger_help_visible_irrelevant_value: false // Beware - don't care whether it true or false, just that it changes
    },
    mutations: {
      'root:set_snackbar': (state, snackbar) => {
        state.snackbar = snackbar
      },
      'root:set_loading': (state, loading_bool) => {
        state.loading = loading_bool
      },
      'root:set_sw_message': (state, sw_message) => {
        state.sw_message = sw_message
      },
      'root:set_instance_config': (state, instance_config) => {
        state.instance_config = instance_config
      },
      'root:network_online': (state, is_online) => {
        state.network_online = is_online
      },
      'root:trigger_help_visible': (state) => {
        state.trigger_help_visible_irrelevant_value = !state.trigger_help_visible_irrelevant_value
      },
      'root:toggle_sidebar': (state) => {
        state.trigger_sidebar_visible_irrelevant_value= !state.trigger_sidebar_visible_irrelevant_value
      }
    },
  })
}

