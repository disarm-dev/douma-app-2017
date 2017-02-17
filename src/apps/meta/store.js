// Store for 'Meta' applet

// Bootstrap user from localstorage
const user = JSON.parse(localStorage.getItem('douma-user'))

export default {
  state: {
    user: user,
    team_id: null,
    online: null
  },
  mutations: {
    'meta:login_user': (state, user) => {
      state.user = user
      localStorage.setItem("douma-user", JSON.stringify(state.user))
    },
    'meta:set_team_id': (state, team_id) => {
      state.team_id = team_id
    },
    'meta:setOnline': (state, online) => {
      state.online = online
    },
    'meta:toast': (state, toast) => {
      state.toast = toast
    }
  }
}
