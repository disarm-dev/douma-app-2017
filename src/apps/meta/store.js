import RemoteDB from '../../lib/data/remote'

export default {
  namespaced: true,
  state: {
    user: null,
    previousRoute: '',
    locations: []
  },
  mutations: {
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
  actions: {
    login: (context, user) => {
      let remote = new RemoteDB()

      return remote.authenticate(user).then(response => {
        if (response.error) {
          return Promise.reject(response)
        }

        let authenticated_user = response
        authenticated_user.version = COMMIT_HASH
        context.commit('set_user', authenticated_user)
        
        return Promise.resolve(authenticated_user)
      })
    },
    logout: (context) => {
      context.commit('set_user', null)
    }
  }
}