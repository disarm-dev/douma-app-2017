// Store for 'Meta' applet

// Bootstrap user from localstorage
// Bootstrap user from localstorage
console.warn('TODO: @refac bootstrap user')
const user = JSON.parse(localStorage.getItem('douma-user'))
const team_id = JSON.parse(localStorage.getItem('douma-team-id'))

export default {
  state: {
    user: user,
    team_id: team_id,
    online: null
  },
  mutations: {
    'meta:login_user': (state, user) => {
      state.user = user
      localStorage.setItem("douma-user", JSON.stringify(state.user))
    },
    'meta:set_team_id': (state, team_id) => {
      state.team_id = team_id
      localStorage.setItem("douma-team-id", JSON.stringify(state.team_id))
    },
    'meta:setOnline': (state, online) => {
      state.online = online
    },
    'meta:toast': (state, toast) => {
      state.toast = toast
    }
  }
}
