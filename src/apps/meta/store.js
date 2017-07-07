import {authenticate} from 'lib/data/remote'
import {decorate_applets} from 'lib/decorated_applets'
import {User} from 'lib/models/user.model'

export default {
  namespaced: true,
  state: {
    user: null,
    previous_route: '',
    locations: [],
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
    login: (context, user) => {

      return authenticate(user).then(response => {
        if (response.error) {
          return Promise.reject(response)
        }

        // Reject user if not authorised for this instance
        if (response.instance_slug !== context.rootState.instance_config.instance.slug && response.instance_slug !== 'all') {
          return Promise.reject({error: 'User not authenticated for this instance'})
        }

        const authenticated_user = new User(response)

        if (authenticated_user.is_valid()) {
          context.commit('set_user', authenticated_user.model)
          return Promise.resolve(authenticated_user.model)
        } else {
          return Promise.reject({error: 'Validation issues with user record.'})
        }

      })
    },
    logout: (context) => {
      context.commit('set_user', null)
    }
  }
}
