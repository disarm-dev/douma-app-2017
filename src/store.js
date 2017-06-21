import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

const persisted = createPersistedState()

function create_store(instance_stores) {

  return new Vuex.Store({
    modules: instance_stores,
    plugins: [persisted],
    state: {
      cache: {},
      snackbar: {message: null},
      loading: false,
      sw_message: {message: 'null', title: 'null'},
      instance_config: {},
      network_online: false,
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
      }
    },
  })
}

export default create_store
