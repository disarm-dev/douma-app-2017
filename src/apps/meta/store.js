// Store for 'Meta' applet

// Bootstrap user from localstorage
// Bootstrap user from localstorage
console.warn('TODO: @refac bootstrap user')
const user = JSON.parse(localStorage.getItem('douma-user'))
const demo_instance_id = JSON.parse(localStorage.getItem('douma-team-id'))

export default {
  state: {
    user: user,
    demo_instance_id: demo_instance_id,
    online: null
  },
  mutations: {
    'meta:login_user': (state, user) => {
      state.user = user
      localStorage.setItem("douma-user", JSON.stringify(state.user))
    },
    'meta:set_demo_instance_id': (state, demo_instance_id) => {
      state.demo_instance_id = demo_instance_id
      localStorage.setItem("douma-team-id", JSON.stringify(state.demo_instance_id))
    },
    'meta:setOnline': (state, online) => {
      state.online = online
    },
    'meta:toast': (state, toast) => {
      state.toast = toast
    }
  }
}
