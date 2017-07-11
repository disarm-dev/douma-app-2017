import {authenticate} from 'lib/data/remote'
import {decorate_applets} from 'lib/decorated_applets'
import {User} from 'lib/models/user.model'

export default {
  namespaced: true,
  state: {
    user: null,
    previous_route: '',
    locations: [],
    personalised_instance_id: 'default'
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

      const original_instance_id = context.state.personalised_instance_id

      return authenticate(login_details).then(response => {
        if (response.error) {
          return Promise.reject(response)
        }

        // Reject user if not authorised for this instance
        if (response.instance_slug !== context.rootState.instance_config.instance.slug && response.instance_slug !== 'all') {
          return Promise.reject({error: 'User not authenticated for this instance'})
        }

        const authenticated_user = new User(response)

        if (authenticated_user.is_valid()) {
          context.dispatch('clear_data_storage').then(() => {
            context.commit('set_personalised_instance_id', login_details.personalised_instance_id)
            context.commit('set_user', authenticated_user.model)
            return Promise.resolve(authenticated_user.model)
          }).catch(err => console.warn('Something unthought of', err))
        } else {
          return Promise.reject({error: 'Validation issues with user record.'})
        }

      })
    },
    logout: (context) => {
      context.commit('set_user', null)
    },
    clear_data_storage: (context) => {
      // TODO: @feature Figure if we need to wipe out local data when changing instance_id
    }
  }
}
