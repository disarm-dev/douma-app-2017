import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { createVuexLoader } from 'vuex-loading'
import objectPath from 'object-path'

let store

export {store}

export function create_store(instance_config, instance_stores) {
  Vue.use(Vuex)

  // vuex-persistedstate
  // Exclude these paths from state persistence
  const excluded_paths = ['sw_update_available', 'sw_message', 'instance_config']

  const persisted_state_options = {
    getState:(key, storage) => {
      const value = storage.getItem(key);

      try {
        return value && value !== 'undefined' ? JSON.parse(value) : undefined;
      } catch (err) {
        return undefined;
      }
    },
    setState: (key, state, storage) => {
      console.warn("👮‍ stringifying whole store into localStorage")
      setTimeout(() => storage.setItem(key, JSON.stringify(state)), 0)
    },
    reducer: (state) => {
      if (excluded_paths.length === 0) {
        return state
      } else {
        const state_copy = Object.assign({}, state)
        excluded_paths.forEach(function(path) {
          objectPath.del(state_copy, path)
        })
        return state_copy
      }
    }
  }

  // vuex-loader
  const VuexLoading = createVuexLoader({
    // The Vuex module name, 'loading' by default.
    moduleName: 'loading',
    // The Vue component name, 'v-loading' by default.
    componentName: 'v-loading',
    // Vue component class name, 'v-loading' by default.
    className: 'v-loading',
  })

  Vue.use(VuexLoading)


  store = new Vuex.Store({
    modules: instance_stores,
    plugins: [createPersistedState(persisted_state_options), VuexLoading.Store],
    // plugins: [VuexLoading.Store],
    state: {
      // Global config
      instance_config: instance_config, // Really important, should maybe be somewhere else

      // Global UI
      snackbar: {message: null},
      sw_message: {message: 'null', title: 'null'},
      sw_update_available: false,
      network_online: false,

      // Irrelevant values: only watched for changes
      trigger_sidebar_visible_irrelevant_value: false,
      trigger_help_visible_irrelevant_value: false, // Beware - don't care whether it true or false, just that it changes

    },
    mutations: {
      'root:set_snackbar': (state, snackbar) => {
        state.snackbar = snackbar // Need to have a {message: "Like this"}
      },
      'root:set_sw_message': (state, sw_message) => {
        state.sw_message = sw_message // Need to have {title: 'title', and message: 'message'}
      },
      'root:set_sw_update_available': (state, sw_update_available) => {
        state.sw_update_available = sw_update_available
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
      },
    },
  })

  return store
}

