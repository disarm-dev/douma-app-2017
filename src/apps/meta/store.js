import RemoteDB from '../../lib/remote'

export default {
  namespaced: true,
  state: {
    user: null
  },
  mutations: {
    set_user: (state, user) => {
      state.user = user
    }
  },
  actions: {
    login: (context, user) => {
      let remote = new RemoteDB()

      return remote.authenticate(user).then(auth_user => {
        auth_user.version = COMMIT_HASH
        context.commit('set_user', auth_user)
        return true
      })
    }
  }
}