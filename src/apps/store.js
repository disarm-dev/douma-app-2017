import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { createVuexLoader } from 'vuex-loading'
import objectPath from 'object-path'
import axios from 'axios'
import {get} from 'lodash'

export function create_store(instance_config, instance_stores) {
  Vue.use(Vuex)

  // vuex-persistedstate
  // Exclude these paths from state persistence
  const excluded_paths = ['sw_update_available', 'sw_message']

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
      console.warn("👮‍ You're doing something dumb. (setting-and-forgetting localStorage with no checks)")
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


  return new Vuex.Store({
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
    actions: {
      standard_handler: (context, {url, options}) => {
        console.log('context', context)
        const HTTP = axios.create()

        HTTP.defaults.timeout = 10000

        HTTP.interceptors.response.use(function (response) {
          context.commit('root:network_online', true)
          return response
        }, function (error) {
          if (/timeout/.test(error.message)) {
            context.commit('root:network_online', false)
          }
          return Promise.reject(error)
        })

        const personalised_instance_id = get(context.rootState, 'meta.personalised_instance_id')
        const version_commit_hash_short = VERSION_COMMIT_HASH_SHORT
        const country = get(context.rootState, 'instance_config.instance.slug')
        const user = get(context.rootState, 'meta.user.username')
        const user_token = 'WE DONT HAVE TOKENS YET'

        const default_options = {}
        default_options.url = url
        default_options.params = {
          personalised_instance_id,
          version_commit_hash_short,
          country,
          instance_slug: country, // TODO: @refac remove 'country' property
          user,
          user_token
        }

        const assigned_options = Object.assign(default_options, options)

        return HTTP(assigned_options)
          .then(json => json.data)
      }
    }
  })
}

