// Store for 'Meta' applet
import {generate_demo_instance_id} from '../../lib/demo_instance_id'
import RemoteDB from '../../lib/remote'

// Bootstrap user from localstorage
// TODO: @refac stop bootstrapping user from localStorage
const user = JSON.parse(localStorage.getItem('douma-user'))

let demo_instance_id = JSON.parse(localStorage.getItem('douma-demo-instance-id'))

if (!demo_instance_id) { 
  demo_instance_id = generate_demo_instance_id()
}

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
      const santized_demo_instance_id = demo_instance_id.replace(/\s/, "_")
      state.demo_instance_id = santized_demo_instance_id
      localStorage.setItem("douma-demo-instance-id", JSON.stringify(state.demo_instance_id))
    },
    'meta:setOnline': (state, online) => {
      state.online = online
    },
    'meta:toast': (state, toast) => {
      state.toast = toast
    }
  },
  actions: {
    'meta:login': (context, user) => {
      let remote = new RemoteDB(context.state.demo_instance_id)

      return remote.authenticate(user).then(response => {
        response.version = COMMIT_HASH
        context.commit('meta:login_user', response)
        return true
      })
    }
  }
}
