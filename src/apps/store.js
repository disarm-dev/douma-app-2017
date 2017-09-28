import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { createVuexLoader } from 'vuex-loading'
import {get, set, cloneDeep} from 'lodash'

let store
import CONFIG from 'config/common'

export {store}

export function create_store(instance_config, instance_stores) {
  // Theses excluded paths are for the root store
  let unpersisted_state = [{store_path: 'sw_update_available', default_value: false}, {store_path: 'sw_message', default_value: {message: null, title: null}}]

  for (const store_name in instance_stores) {
    const store = instance_stores[store_name]
    const paths = get(store, 'unpersisted_state_keys', [])

    paths.forEach(path => {
      const store_path = `${store_name}.${path}`
      const default_value = get(store.state, path, 'eggs')
      unpersisted_state.push({store_path, default_value})
    })
  }
  
  Vue.use(Vuex)

  // vuex-persistedstate
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
      setTimeout(() => storage.setItem(key, JSON.stringify(state)), 0)
    },
    reducer: (state) => {
      if (unpersisted_state.length === 0) {
        return state
      } else {
        const state_copy = cloneDeep({}, state)

        unpersisted_state.forEach(function({store_path, default_value}) {
          set(state_copy, store_path, default_value)
        })

        return state_copy
      }
    }
  }

  // vuex-loader
  const VuexLoading = createVuexLoader(CONFIG.vuex_loader_options)
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
      sw_message: {message: null, title: null},
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

