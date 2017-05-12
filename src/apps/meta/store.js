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
    }
  },
  actions: {
    login: (context, user) => {
      let remote = new RemoteDB()

      // // TODO: @debug Restore real users logging in
      // const fake_user = {"_id":"000e5588-0599-4d6c-90a6-63837809e3a9","name":"Philile (Manager)","password":"malaria","email":"b@b.com","allowed_apps":{"read":["irs_record_point","irs_monitor"],"write":["irs_record_point","irs_monitor"]},"version":"ef426a52ee69db57b9b90f43fe8f257dbfabc3c6"}
      // return Promise.resolve(context.commit('set_user', fake_user))

      return remote.authenticate(user).then(auth_user => {
        auth_user.version = COMMIT_HASH
        context.commit('set_user', auth_user)
        return true
      })
    },
    logout: (context) => {
      context.commit('set_user', null)
    }
  }
}