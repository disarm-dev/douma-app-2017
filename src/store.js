import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

function create_store(instance_stores) {
  return new Vuex.Store({
    modules: instance_stores,
    plugins: [createPersistedState()],
    state: {
      snackbar: {},
      loading: false,
      sw_message: {message: 'null', title: 'null'},
      instance_config: {}
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
      }
    },
  })
}

export default create_store
