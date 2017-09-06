import Raven from 'raven-js'
import get from 'lodash.get'

import {authenticate} from 'lib/remote/authenticate'
import {decorate_applets} from 'lib/instance_data/decorated_applets'
import {User} from 'lib/models/user/model'
import {set_raven_user_context} from 'config/error_tracking.js'

export default {
  namespaced: true,
  state: {
    user: null,
    previous_route: '',
    locations: [],
    personalised_instance_id: 'default',
  },
  mutations: {
    set_previous_route: (state, previous_route) => {
      state.previous_route = previous_route
    },
    set_user: (state, user) => {
      state.user = user
    },
    add_location: (state, location) => {
      state.locations.unshift(location)
    },
    update_location: (state, location) => {
      const index = state.locations.findIndex(l => l.id === location.id)
      state.locations.splice(index, 1, location)
    },
    delete_location: (state, location) => {
      const index = state.locations.findIndex(l => l.id === location.id)
      state.locations.splice(index, 1)
    },
    clear_locations: (state) => {
      state.locations = []
    },
    set_personalised_instance_id: (state, personalised_instance_id) => {
      state.personalised_instance_id = personalised_instance_id || 'default'
    }
  },
  getters: {
    decorated_applets(state, getters, rootState) {
      // Figure out which applets are allowed, and only decorate and show these!
      if (!state.user) return []

      const user_allowed_applets = state.user.allowed_apps.read
      const instance_applets = rootState.instance_config.applets

      const decorated_applets = decorate_applets({user_allowed_applets, instance_applets})

      return decorated_applets
    }
  },
  actions: {
    login: (context, login_details) => {

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
          context.dispatch('clear_data_storage', {instance_id_changed, authenticated_user: authenticated_user.model}).then(() => {

            // Set some basic stuff
            context.commit('set_personalised_instance_id', login_details.personalised_instance_id)
            context.commit('set_user', authenticated_user.model)

            // Add extra info to error logging
            set_raven_user_context(context.rootState)

            return Promise.resolve(authenticated_user.model)

          }).catch(err => console.warn('Something unthought of', err))

        } else {
          return Promise.reject({error: 'Validation issues with user record.'})
        }

      })
    },
    logout: (context) => {
      Raven.setUserContext({
        instance_slug: context.rootState.instance_config.instance.slug
      })

      context.commit('set_user', null)
    },
    clear_data_storage: (context, {instance_id_changed, authenticated_user}) => {
      if (!instance_id_changed) return // Nothing changed

      const applets = get(authenticated_user, 'allowed_apps.read', [])
      applets.forEach(applet => {
        const mutation  = `${applet}/clear_data_storage`
        context.commit(mutation, {}, {root: true})
      })
      console.warn('Instance changed. Local data storage cleared for:', applets.join(', '))
    }
  }
}
