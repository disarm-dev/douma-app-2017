// Store for 'Meta' applet

// Bootstrap user from localstorage
const user = JSON.parse(localStorage.getItem('douma-user'))
let demo_instance_id = JSON.parse(localStorage.getItem('douma-demo-instance-id'))

function generate_demo_instance_id() {
  const vowels = ["a","e","i","o","u"]
  const consonants = ["b","c","d","f","g","h","j","k","l","m","n","p","q","r","s","t","v","x","w","y","z"]
  let output = ''
  for (let i = 1; i <= 8; i++) {
    let character
    if(i % 2 === 0) {
      character = vowels[(Math.floor(Math.random() * vowels.length))]
    } else {
      character = consonants[(Math.floor(Math.random() * consonants.length))]
    }
    output += character
  }
  return output + '-' + new Date().getMilliseconds()
}

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
  }
}
