import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { createVuexLoader } from 'vuex-loading'
import objectPath from 'object-path'
import axios from 'axios'
import {get} from 'lodash'
import Raven from 'raven-js'

import CONFIG from 'config/common'
import {authenticate} from 'lib/remote/authenticate'
import {decorate_applets} from 'lib/instance_data/decorated_applets'
import {User} from 'lib/models/user/model'
import {set_raven_user_context} from 'config/error_tracking.js'

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
      user: null,
      previous_route: '',
      personalised_instance_id: 'default',

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

      'root:set_previous_route': (state, previous_route) => {
        state.previous_route = previous_route
      },
      "root:set_user": (state, user) => {
        state.user = user
      },
      "root:set_personalised_instance_id": (state, personalised_instance_id) => {
        state.personalised_instance_id = personalised_instance_id || 'default'
      }
    },
    getters: {
      "root:decorated_applets": (state) => {
        // Figure out which applets are allowed, and only decorate and show these!
        if (!state.user) return []

        const user_allowed_applets = state.user.allowed_apps.read
        const instance_applets = state.instance_config.applets

        const decorated_applets = decorate_applets({user_allowed_applets, instance_applets})

        return decorated_applets
      }
    },
    actions: {
      standard_handler: (context, {url, options}) => {
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

        const personalised_instance_id = get(context.state, 'personalised_instance_id')
        const version_commit_hash_short = VERSION_COMMIT_HASH_SHORT
        const country = get(context.state, 'instance_config.instance.slug')
        const user = get(context.state, 'user.username')
        const user_token = 'WE DONT HAVE TOKENS YET'

        const default_options = {}
        const douma_api_root = `${CONFIG.api.url}/${CONFIG.api.version}`
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
      },
      try_reconnect: (context) => {
        context.dispatch('standard_handler', {url: CONFIG.api.url})
      },
      get_version: (context) => {
        const options = {
          timeout: 2000
        }
        return context.dispatch('standard_handler', {url: '/VERSION', options})
      },
      need_to_update: (context) => {
        return context.dispatch('get_version').then((remote_version) => {
          if (remote_version && (remote_version !== VERSION_COMMIT_HASH_SHORT)) {
            console.log(`🔺 DiSARM version check: New version available ${remote_version}, can/should update.`)
            return {status: 'CAN_UPDATE', local_version: VERSION_COMMIT_HASH_SHORT, remote_version: remote_version}
          } else {
            console.log("✅ DiSARM version check: Already running most recent version")
            return {status: 'ON_LATEST', local_version: VERSION_COMMIT_HASH_SHORT, remote_version: remote_version}
          }
        }).catch(err => {
          console.log("🤷‍ DiSARM version check: No information on new version (network request failed)")
          return {status: "NO_RESPONSE", local_version: VERSION_COMMIT_HASH_SHORT}
        })
      },

      // User stuff
      "root:login": (context, login_details) => {

        const instance_id_changed = (login_details.personalised_instance_id !== context.state.personalised_instance_id)

        return authenticate(login_details).then(response => {
          if (response.error) {
            return Promise.reject(response)
          }

          // Reject user if not authorised for this instance
          if (response.instance_slug !== context.rootState.instance_config.instance.slug && response.instance_slug !== 'all') {
            return Promise.reject({error: 'User not authenticated for this instance'})
          }

          const authenticated_user = new User(response)

          // You have a valid, authenticated user
          if (authenticated_user.is_valid()) {

            // Start by clearing instance-specific data ONLY if instance_id has changed
            context.dispatch('root:clear_data_storage', {instance_id_changed, authenticated_user: authenticated_user.model}).then(() => {

              // Set some basic stuff
              context.commit('root:set_personalised_instance_id', login_details.personalised_instance_id)
              context.commit('root:set_user', authenticated_user.model)

              // Add extra info to error logging
              set_raven_user_context(context.rootState)

              return Promise.resolve(authenticated_user.model)

            }).catch(err => console.warn('Something unthought of', err))

          } else {
            return Promise.reject({error: 'Validation issues with user record.'})
          }

        })
      },
      "root:logout": (context) => {
        Raven.setUserContext({
          instance_slug: context.rootState.instance_config.instance.slug
        })

        context.commit('root:set_user', null)
      },
      "root:clear_data_storage": (context, {instance_id_changed, authenticated_user}) => {
        if (!instance_id_changed) return // Nothing changed

        const applets = get(authenticated_user, 'allowed_apps.read', [])
        applets.forEach(applet => {
          const mutation  = `${applet}/clear_data_storage`
          context.commit(mutation, {}, {root: true})
        })
        console.warn('Instance changed. Local data storage cleared for:', applets.join(', '))
      }
    }
  })
}

